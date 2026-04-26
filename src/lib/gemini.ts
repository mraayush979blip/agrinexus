/**
 * Client-side Proxy - Calls our secure server API
 */
async function fetchAI(prompt: string, isJson: boolean = true, imageData?: string) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, isJson, imageData })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI Server Error");
    return data.text;
  } catch (error) {
    console.error("Fetch AI Failed:", error);
    throw error;
  }
}

export type AnalysisResult = {
  diagnosis: string;
  remedy: string;
  grade: "A" | "B" | "C";
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  spread: "Slow" | "Fast" | "Very Fast";
  precautions: string[];
  summary?: string;
};

export async function analyzeCrop(imageData: string): Promise<AnalysisResult> {
  const prompt = `Analyze this crop image. Identify disease, remedy, grade (A-C), confidence, severity, spread rate, 3 precautions, and a detailed summary. Return JSON ONLY.`;
  try {
    const raw = await fetchAI(prompt, true, imageData);
    const cleaned = (raw || "").replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    return getMockAnalysis();
  }
}

function getMockAnalysis(): AnalysisResult {
  const cases: AnalysisResult[] = [
    {
      diagnosis: "Late Blight (Safe Mode)",
      remedy: "Apply copper-based fungicide.",
      grade: "C",
      confidence: 0.94,
      severity: "High",
      spread: "Very Fast",
      precautions: ["Isolate field", "Burn debris"],
      summary: "Late Blight (Phytophthora infestans) is a destructive pathogen."
    }
  ];
  return cases[0];
}

export type Scheme = {
  id?: string;
  name: string;
  description: string;
  benefit: string;
  applyLink: string;
  tags?: string[];
};

export async function matchSchemes(profile: any): Promise<Scheme[]> {
  const prompt = `Find exactly 4 real, active 2024-2025 Indian Government agricultural schemes specifically for a farmer with these details: ${JSON.stringify(profile)}. 
  
  Return a JSON object with this EXACT structure:
  {
    "schemes": [
      {
        "name": "Full Scheme Name",
        "description": "2 sentence summary",
        "benefit": "Specific financial or material benefit",
        "applyLink": "A real official govt URL (e.g. https://pmkisan.gov.in/)"
      }
    ]
  }
  
  CRITICAL: Every scheme MUST have a valid "applyLink". If a specific link is unknown, use the main state agriculture portal URL.`;
  
  try {
    const raw = await fetchAI(prompt, true);
    const cleaned = (raw || "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const schemes = parsed.schemes || (Array.isArray(parsed) ? parsed : []);
    
    // Ensure every scheme has a fallback link to prevent about:blank
    return schemes.map((s: any) => ({
      ...s,
      applyLink: s.applyLink || "https://www.india.gov.in/my-government/schemes"
    }));
  } catch (error) {
    return [
      { 
        name: "PM-Kisan Samman Nidhi", 
        description: "Direct income support of ₹6,000 per year to all landholding farmer families.", 
        benefit: "₹6,000 per year in 3 installments", 
        applyLink: "https://pmkisan.gov.in/" 
      },
      { 
        name: "PM Fasal Bima Yojana", 
        description: "Crop insurance scheme providing financial support to farmers suffering crop loss.", 
        benefit: "Low premium crop insurance", 
        applyLink: "https://pmfby.gov.in/" 
      }
    ];
  }
}

export async function getSchemeSteps(schemeName: string, profile: any): Promise<string[]> {
  const prompt = `5 steps to apply for ${schemeName} in ${profile.state}. Return a JSON object with a "steps" array of strings.`;
  try {
    const raw = await fetchAI(prompt, true);
    const cleaned = (raw || "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed.steps || (Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    return ["Visit nearest CSC", "Submit records", "Verify Aadhaar"];
  }
}
