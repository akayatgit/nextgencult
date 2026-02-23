import { NextResponse } from "next/server";

function readableTimestamp() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      whatsapp,
      currentStatus,
      city,
      timeAvailable,
      currentSkills,
      interests,
      strengthsWeaknesses,
      goalTimeline,
      riskPreference,
      ageRange,
      budgetRange,
      courseJoined,
      email,
    } = body;

    if (!name || !whatsapp || !currentStatus) {
      return NextResponse.json(
        { error: "Name, WhatsApp, and Current Status are required" },
        { status: 400 }
      );
    }

    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL) {
      console.error("GOOGLE_SCRIPT_URL env variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Format WhatsApp as plain text (no leading + to avoid Sheets formula error)
    const waClean = whatsapp.replace(/^\+/, "").replace(/\D/g, "");

    // Prepare email body
    const emailBody = `
New Roadmap Request

Name: ${name}
WhatsApp: +91 ${waClean}
Email: ${email || "Not provided"}
Current Status: ${currentStatus}
City: ${city || "Not provided"}
Time Available: ${timeAvailable || "Not provided"}
Current Skills: ${currentSkills || "Not provided"}
Interests: ${interests || "Not provided"}
Strengths & Weaknesses: ${strengthsWeaknesses || "Not provided"}
Goal Timeline: ${goalTimeline || "Not provided"}
Risk Preference: ${riskPreference || "Not provided"}
Age Range: ${ageRange || "Not provided"}
Budget Range: ${budgetRange || "Not provided"}
Course Already Joined: ${courseJoined || "Not provided"}

Timestamp: ${readableTimestamp()}
    `.trim();

    // Send to Google Script (same as waitlist)
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: readableTimestamp(),
        type: "roadmap_request",
        name,
        whatsapp: waClean,
        email: email || "",
        currentStatus: currentStatus || "",
        city: city || "",
        timeAvailable: timeAvailable || "",
        currentSkills: currentSkills || "",
        interests: interests || "",
        strengthsWeaknesses: strengthsWeaknesses || "",
        goalTimeline: goalTimeline || "",
        riskPreference: riskPreference || "",
        ageRange: ageRange || "",
        budgetRange: budgetRange || "",
        courseJoined: courseJoined || "",
        emailBody,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Google Script error:", text);
      return NextResponse.json(
        { error: "Failed to save data" },
        { status: 502 }
      );
    }

    // If you have an email service, send email here
    // For now, the Google Script can handle email sending

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Roadmap API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
