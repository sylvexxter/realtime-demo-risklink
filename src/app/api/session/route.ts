import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  // Clear out old JSON reports for a fresh session
  const reportDir = path.join(process.cwd(), 'src', 'json_reports', 'initialRiskAssessment');
  try {
    const files = await fs.readdir(reportDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(reportDir, file));
      }
    }
  } catch (err) {
    console.error('Error clearing old JSON reports:', err);
  }
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
        }),
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
