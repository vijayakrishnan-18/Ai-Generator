import { Course_config_prompt } from "@/data/Prompt";
import { NextRequest, NextResponse } from "next/server";
import { openaiClient } from "@/config/openai";
import { courseTable } from "@/config/schema";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userInput, courseId, type } = await request.json();
    const user = await currentUser();

    // Debugging environment variables and input
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable");
      return NextResponse.json({ error: "Server Configuration Error: Missing API Key" }, { status: 500 });
    }

    console.log("Processing request with userInput:", userInput);

    const response = await openaiClient.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: "system",
          content: Course_config_prompt
        },
        {
          role: "user",
          content: `Generate a course config for the following topic: ${userInput}`
        }
      ]
    });

    const rawResult = response.choices[0].message?.content || '';
    console.log("Raw AI Response:", rawResult);

    if (!rawResult) {
      throw new Error("Empty response from AI model");
    }

    let JSONResult;
    try {
      // Attempt to clean markdown code blocks if present
      const cleanedResult = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      JSONResult = JSON.parse(cleanedResult);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse AI response as JSON. Raw response: " + rawResult);
    }

    //Save to DB
    const courseResult = await db.insert(courseTable).values({
      courseId: courseId,
      courseName: JSONResult.courseName,
      userInput: userInput,
      type: type,
      courseLayout: JSONResult,
      userId:user?.primaryEmailAddress?.emailAddress || ""
    }).returning();

    return NextResponse.json(courseResult[0]);
  } catch (error: any) {
    console.error("Error generating course layout:", error);
    return NextResponse.json({
      error: "Failed to generate course layout",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
