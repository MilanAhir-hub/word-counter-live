/**
 * Service to interact with the Google Gemini API securely.
 * Uses a backend API proxy to hide the API key.
 */

const generateContent = async (systemInstruction, userText, strength = 'medium') => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction,
        userText,
        strength
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || ('API Error (' + response.status + ')'));
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw error;
  }
};

const generateContentWithDebug = async (systemInstruction, userText, strength = 'medium') => {
  try {
    console.log("[AI Request] Request sent to AI: POST /api/generate");
    console.log("[AI Request] Prompt sent to AI:", systemInstruction);
    console.log("[AI Request] Input sent to AI:", userText);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction,
        userText,
        strength,
        isDictionary: true 
        }),
        });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || ('API Error (' + response.status + ')'));
    }

    const data = await response.json();
    console.log("[AI Response] AI Provider used:", data.debug?.model || "Gemini");
    console.log("[AI Response] Raw AI response received:", data.text);
    return data;
  } catch (error) {
    console.error("[AI Response] AI Generation failed:", error);
    throw error;
  }
};

// ==================== EXPORTED API FUNCTIONS ====================

export const fixGrammar = async (text) => {
  const instruction = "Correct all grammatical, spelling, punctuation, and structural errors in the following text. Do NOT change the tone, style, or vocabulary of the text—only fix mistakes. Keep the original wording as close as possible. Output ONLY the corrected text without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'light');
};

export const rewriteText = async (text, strength = 'medium') => {
  const strengthInstruction = strength === 'light' 
    ? "Apply minimal rewrites, polishing vocabulary slightly while keeping the sentence structures intact."
    : strength === 'strong'
    ? "Perform a comprehensive rewrite, fully elevating the vocabulary, structure, and readability to professional premium standards. Expand short inputs into complete, natural messages."
    : "Polishing wording and tone, maintaining standard structural layout.";
    
  const instruction = `Rewrite the following text to enhance its phrasing and variety of expression while fully preserving its core meaning.\nRewrite Strength: ${strength.toUpperCase()}\nRequirement: ${strengthInstruction}\nOutput ONLY the rewritten text without any chat intro, explanations, quotes or wrappers.`;
  return generateContent(instruction, text, strength);
};

export const improveClarity = async (text) => {
  const instruction = "Improve the clarity, readability, and sentence flow of the following text. Make it direct and concise while keeping the original meaning. Output ONLY the improved text without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'medium');
};

export const shortenText = async (text) => {
  const instruction = "Make the following text concise by reducing wordiness and simplifying sentence structures without losing any key information or meaning. Output ONLY the shortened text without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'medium');
};

export const expandText = async (text) => {
  const instruction = "Elaborate and add relevant detail, context, and depth to the following text without adding fluff. Maintain the original tone. Output ONLY the expanded text without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'medium');
};

export const changeTone = async (text, tone, strength = 'medium') => {
  let prompt = "";
  if (tone === "Professional") {
    const strengthDesc = strength === 'light'
      ? "Apply minimal formal edits, correcting wording slightly without structural re-arrangements."
      : strength === 'strong'
      ? "Provide a full expert rewrite. Expand short or incomplete inputs (e.g. 1-5 words) into complete business-standard messages, automatically adding professional greetings, body paragraphs, and formal closings/sign-offs. Ensure the output is highly polished, articulate, and completely ready to send in a workplace environment."
      : "Improve wording and tone. Correct informal phrasing to sound polished, workplace-appropriate, and professional.";

    prompt = `You are an expert business writer and communication specialist.
Rewrite the user's text in a highly professional, polished, workplace-appropriate tone.

Rewrite Strength: ${strength.toUpperCase()}
Strength Requirements:
* ${strengthDesc}

Core Requirements:
* Preserve the original meaning and intent.
* Improve clarity, grammar, and vocabulary.
* Remove slang, casual language, and informal expressions.
* Improve sentence structure.
* Expand short or incomplete inputs into complete professional messages when necessary.
* For very short inputs, infer the likely intent and generate a natural professional communication.
* The output should sound as though it was written by an experienced professional.
* Return only the rewritten text.`;
  } else {
    const strengthDesc = strength === 'light'
      ? "Make light modifications to vocabulary to fit the tone."
      : strength === 'strong'
      ? "Fully rewrite and adapt the vocabulary, sentence structure, and style to fit the tone. Expand short inputs into natural complete communications."
      : "Polishing wording and tone.";

    prompt = `Rewrite the following text using a precise ${tone} tone. Adapt the vocabulary and styling to suit this tone while preserving the original facts and meaning.
Rewrite Strength: ${strength.toUpperCase()}
Requirement: ${strengthDesc}
Output ONLY the updated text without any chat intro, explanations, quotes or wrappers.`;
  }
  
  return generateContent(prompt, text, strength);
};

export const summarizeText = async (text) => {
  const instruction = "Provide a clear, cohesive, and concise summary of the following text. Focus on the most important points. Output ONLY the summary without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'medium');
};

export const seoOptimize = async (text) => {
  const instruction = "Rewrite the following text to optimize it for search engines (SEO). Enhance keyword naturalness, readability, sentence structure, and engagement while preserving the original meaning. Output ONLY the optimized text without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'medium');
};

export const humanizeText = async (text) => {
  const instruction = "Rewrite the following text (which may be AI-generated) to sound fully natural, engaging, and human-like. Use varied sentence lengths, natural phrasing, and an conversational flow. Output ONLY the humanized text without any chat intro, explanations, quotes or wrappers.";
  return generateContent(instruction, text, 'medium');
};

export const findSynonyms = async (text) => {
  const instruction = `You are a professional dictionary and thesaurus.

For the provided word or short phrase:
* Generate a concise definition.
* Generate 10–20 high-quality synonyms.
* Generate 5–10 antonyms.
* Return structured output.

Format:

Definition:
...

Synonyms:
* ...
* ...
* ...

Antonyms:
* ...
* ...
* ...

Return only the result.`;
  return generateContentWithDebug(instruction, text, 'medium');
};
