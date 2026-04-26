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
  const prompt = `Find 4 latest 2024-2025 Indian Govt schemes for: ${JSON.stringify(profile)}. Return a JSON object with a "schemes" array.`;
  try {
    const raw = await fetchAI(prompt, true);
    const cleaned = (raw || "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed.schemes || (Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    return [{ name: "PM-Kisan", description: "Real-time AI Match Failed. Check API keys.", benefit: "₹6,000/year", applyLink: "https://pmkisan.gov.in/" }];
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
