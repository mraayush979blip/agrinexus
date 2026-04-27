import { NextResponse } from 'next/server';

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { prompt, isJson, imageData } = await req.json();
    const apiKeyGroq = process.env.NEXT_PUBLIC_GROQ_API_KEY?.trim();
    const apiKeyGemini = process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

    // 1. VISION (Gemini)
    if (imageData) {
      const res = await fetch(`${GEMINI_URL}?key=${apiKeyGemini}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: imageData.split(",")[1] } }
            ]
          }]
        })
      });
      const data = await res.json();
      return NextResponse.json({ text: data?.candidates?.[0]?.content?.parts?.[0]?.text });
    }

    // 2. TEXT (Primary: Gemini for Market/Schemes)
    const res = await fetch(`${GEMINI_URL}?key=${apiKeyGemini}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (geminiText) {
      return NextResponse.json({ text: geminiText });
    }

    // 3. FALLBACK (Groq)
    if (apiKeyGroq) {
      // ... groq logic (optional fallback)
    }

  } catch (error: any) {
    console.error("Server AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
