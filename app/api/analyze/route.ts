import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { description, location, people } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Emergency description is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are an emergency information assistant.

Analyze this emergency report and return ONLY valid JSON.

Description: ${description}
Location: ${location || "Not provided"}
People affected: ${people || 1}

Return exactly this structure:

{
  "category": "medical | accident | fire | natural_disaster | other",
  "urgency": "low | medium | high | critical",
  "key_information": ["important fact 1", "important fact 2"],
  "guidance": ["general safety guidance 1", "general safety guidance 2"]
}

Important:
- Do not diagnose medical conditions.
- Do not claim certainty.
- Provide general safety guidance only.
- Encourage contacting appropriate local emergency services when the situation may be serious.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text || "";

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: databaseError } = await supabase
      .from("incidents")
      .insert({
        description,
        location: location || null,
        people: people || 1,
        category: result.category,
        urgency: result.urgency,
        key_information: result.key_information,
        guidance: result.guidance,
      });

    if (databaseError) {
      console.error("Supabase error:", databaseError);

      return NextResponse.json(
        {
          error:
            "AI analysis succeeded, but saving the incident failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI analysis error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}