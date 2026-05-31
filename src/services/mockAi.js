/**
 * Clean up markdown markers or quotes if the AI accidentally wrapped the output.
 */
export const sanitizeOutput = (text) => {
  let cleaned = text.trim();
  // Strip starting/ending markdown backticks if any
  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
  }
  // Strip surrounding quotes if the AI wrapped the entire string
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
};

/**
 * A highly sophisticated client-side mockup engine that provides realistic writing corrections,
 * tone changes, expansion, shortening, and summarization.
 */
export const simulateMockAi = async (instruction, text, strength = 'medium') => {
  // Add small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 850));

  const trimmed = text.trim();
  if (!trimmed) return "";

  const lowerText = trimmed.toLowerCase();
  
  // Detect short inputs (1 to 5 words)
  const words = trimmed.split(/\s+/);
  const isShort = words.length <= 5;


  // 1. GRAMMAR FIX: Strictly corrects typos without modifying tone or style
  if (instruction.includes("grammar") || instruction.includes("Grammar")) {
    let corrected = trimmed
      .replace(/\brecieve\b/gi, "receive")
      .replace(/\bteh\b/gi, "the")
      .replace(/\bseperate\b/gi, "separate")
      .replace(/\bdont\b/g, "don't")
      .replace(/\bcant\b/g, "can't")
      .replace(/\bwont\b/g, "won't")
      .replace(/\bits\b(?=\s+a|\s+an|\s+the|\s+very|\s+so)/g, "it's")
      .replace(/\bi\b/g, "I")
      .replace(/(\.|\?|!)\s+([a-z])/g, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`);
    
    // Capitalize first letter
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    return corrected;
  }

  // 2. PROFESSIONAL TONE: Smart intent analysis, rephrasing, and email expansion
  if (instruction.includes("Professional") || instruction.includes("tone-professional")) {
    
    // If input is short, expand into complete professional messages depending on strength
    if (isShort) {
      const isHello = lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey") || lowerText.includes("bro");
      const isThanks = lowerText.includes("thanks") || lowerText.includes("thank") || lowerText.includes("thx");
      const isFile = lowerText.includes("send") || lowerText.includes("file") || lowerText.includes("give");

      if (isHello) {
        if (strength === 'light') {
          return "Hello, I hope you are doing well.";
        }
        if (strength === 'medium') {
          return "Hello,\n\nI hope you are doing well and having a good week. I wanted to reach out and connect with you.";
        }
        return "Hello,\n\nI hope you are doing well. I wanted to reach out and connect with you. Please let me know if there is anything I can assist you with.\n\nBest regards,";
      }

      if (isThanks) {
        if (strength === 'light') {
          return "Thank you for your assistance.";
        }
        if (strength === 'medium') {
          return "Thank you very much. I greatly appreciate your support on this matter.";
        }
        return "Dear Team,\n\nThank you very much for your time and assistance with this matter. Your prompt support is highly valued.\n\nBest regards,";
      }

      if (isFile) {
        if (strength === 'light') {
          return "Please send me the file.";
        }
        if (strength === 'medium') {
          return "Could you please send me the requested file at your convenience?";
        }
        return "Hello,\n\nCould you please send me the requested file at your earliest convenience? I would greatly appreciate it.\n\nThank you.";
      }

      // Generic short input expansion
      if (strength === 'light') {
        return `Please be advised regarding: ${trimmed}.`;
      }
      if (strength === 'medium') {
        return `Hello, could you please review the request regarding "${trimmed}" at your convenience?`;
      }
      return `Hello,\n\nI hope this email finds you well.\n\nCould you please review the details regarding "${trimmed}" at your earliest convenience? Let me know if you need any additional context or support.\n\nThank you very much.`;
    }

    // Longer input professional rewrites
    const polishedText = trimmed
      .replace(/\bguy(s)?\b/gi, "colleagues")
      .replace(/\b(hate|dislike)\b/gi, "prefer to optimize")
      .replace(/\bshut up\b/gi, "please maintain silence")
      .replace(/\b(wont|can't do it)\b/gi, "am currently unable to accommodate this request");

    if (strength === 'light') {
      return `Polished phrasing: ${polishedText}`;
    }
    if (strength === 'medium') {
      return `I have reviewed your text and formatted it to professional standards:\n\n"We are pleased to present the following updated draft: ${polishedText}"`;
    }
    return `Dear Colleagues,\n\nI am writing to formally present our refined updates. We have structured and aligned the communication to meet core corporate standards:\n\n"${polishedText}"\n\nThank you for your ongoing partnership. Please let me know if you have any further questions.\n\nSincerely,`;
  }

  // 3. FRIENDLY TONE: Warm conversational formatting
  if (instruction.includes("Friendly") || instruction.includes("tone-friendly")) {
    if (isShort && lowerText.includes("shut up")) {
      return "Hey there! Could we please have some quiet for a moment? I would really appreciate a bit of peace and quiet. Thank you! 😊";
    }
    return `Hey friend! I've polished your text to be warm and conversational: "Hey! ${trimmed.replace(/\b(i|we) want\b/gi, "we'd love to").replace(/\b(must|should)\b/gi, "can easily")}! 😊 Let me know if that works for you!"`;
  }

  // 4. ACADEMIC TONE: High-level thesis formatting
  if (instruction.includes("Academic") || instruction.includes("tone-academic")) {
    if (isShort && lowerText.includes("shut up")) {
      return "It is scientifically recommended that auditory output be temporarily suspended to facilitate a more focused academic discourse.";
    }
    return `Academic Formulation:\n\n"The empirical analysis suggests the following: ${trimmed.replace(/\b(i|we|you)\b/gi, "the researcher(s)")}"`;
  }

  // 5. SUMMARIZE: Bulleted summary checklists
  if (instruction.includes("summary") || instruction.includes("summarize")) {
    const sentences = trimmed.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    if (sentences.length <= 2) {
      return `Summary Checklist:\n- Focuses on the core concept of "${trimmed.slice(0, 30)}..."\n- Outlines key actionable takeaways for the readers.`;
    }
    return `Summary: ${sentences[0]}. Furthermore, it emphasizes that ${sentences[sentences.length - 1].charAt(0).toLowerCase() + sentences[sentences.length - 1].slice(1)}.`;
  }

  // 6. SHORTEN: Streamlining
  if (instruction.includes("concise") || instruction.includes("shorten")) {
    const words = trimmed.split(/\s+/);
    if (words.length <= 6) return `${trimmed} [Streamlined]`;
    const cutCount = Math.ceil(words.length * 0.6);
    return words.slice(0, cutCount).join(" ") + "... [Concise phrasing active]";
  }

  // 7. EXPAND: Context additions
  if (instruction.includes("Elaborate") || instruction.includes("expand")) {
    return `${trimmed}\n\nTo expand on this concept: this particular statement holds deep strategic value. By implementing active feedback loops and refining our syntax, we unlock additional dimensions of quality and structural depth.`;
  }

  // 8. SEO: Keyword integration
  if (instruction.includes("SEO") || instruction.includes("search engines")) {
    return `⭐ High-Impact SEO: ${trimmed}\n\n[Primary Keywords: professional editor, word counter, AI writing assistant, writing tool]`;
  }

  // 9. HUMANIZE: Authentic human voice
  if (instruction.includes("human-like") || instruction.includes("humanize")) {
    if (isShort && lowerText.includes("shut up")) {
      return "Honestly, could we just get some quiet? Let's take a quick breath and focus. Thanks!";
    }
    return `Here is a natural, human-like voice version:\n\n"Honestly, here's the thing: ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)} It just feels way more authentic and conversational this way, don't you think?"`;
  }

  // DEFAULT FALLBACK
  return `Refined phrasing:\n\n"${trimmed.replace(/\b(very|extremely)\b/gi, "highly")}"\n\n(Polished for balance and professional flow.)`;
};
