/**
 * AgriNexus AI - Gemini Service Layer
 * Optimized for Gemini 1.5 Flash (Free Tier)
 */

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export type AnalysisResult = {
  diagnosis: string;
  remedy: string;
  grade?: string;
  confidence: number;
};

/**
 * Unified call to save credits.
 * Performs Diagnosis, Remediation, and Grading in ONE request.
 */
export async function analyzeCrop(imageData: string): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const prompt = `
    Analyze this crop image for an Indian farmer. 
    1. Identify any disease (Diagnosis).
    2. Suggest a low-cost, organic remediation (Remedy).
    3. Assign a quality grade from A to C based on visual health (Grade).
    4. Provide a confidence score (0-1).
    
    Return ONLY a valid JSON object in this format:
    { "diagnosis": "string", "remedy": "string", "grade": "A|B|C", "confidence": 0.95 }
  `;

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: imageData.split(',')[1] } }
          ]
        }]
      })
    });

    const data = await response.json();
    const textResult = data.candidates[0].content.parts[0].text;
    
    // Cleaning the response to ensure it's valid JSON
    const jsonStr = textResult.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      diagnosis: "Unknown Issue",
      remedy: "Consult local FPO",
      grade: "B",
      confidence: 0
    };
  }
}

/**
 * AI Scheme Matcher
 */
export async function matchSchemes(farmerData: any): Promise<string[]> {
  // Uses Gemini's Search Grounding to find relevant Indian Govt schemes
  // Mocking the prompt structure for now
  const prompt = `Match government schemes for a farmer with: ${JSON.stringify(farmerData)}`;
  // ... similar fetch logic
  return ["PM-Kisan", "Crop Insurance"];
}
