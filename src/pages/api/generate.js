import { sanitizeOutput, simulateMockAi } from '../../services/mockAi.js';

export const POST = async ({ request }) => {
  try {
    const { systemInstruction, userText, strength, isDictionary } = await request.json();
    
    // The key is safely read from process.env on the server side
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    const isDummyKey = !apiKey || apiKey === 'YOUR_KEY_HERE';

    if (isDictionary && isDummyKey) {
      return new Response(JSON.stringify({ 
        error: "Google Gemini API Key is required for Dictionary search. Local mock fallback is disabled for this feature to ensure 100% real AI results." 
      }), { status: 403 });
    }

    if (isDummyKey) {
      console.warn("Using mock AI because API key is missing or dummy.");
      const mockResult = await simulateMockAi(systemInstruction, userText, strength);
      return new Response(JSON.stringify({ text: mockResult }), { status: 200 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemInstruction}\n\nInput Text:\n"""\n${userText}\n"""`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: strength === 'light' ? 0.1 : strength === 'strong' ? 0.35 : 0.2,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || response.statusText;
      throw new Error(`Gemini API Error: ${errMsg}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("No response from Gemini API.");
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      model: "gemini-2.5-flash",
      requestId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
    };

    return new Response(JSON.stringify({ 
      text: sanitizeOutput(candidateText),
      debug: debugInfo
    }), { status: 200 });

  } catch (error) {
    console.error("API proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
