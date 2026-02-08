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
    const { name, whatsapp, email, city, career, preferredLocation, plan } = body;

    if (!name || !whatsapp || !email || !career || !plan) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL) {
      console.error("GOOGLE_SCRIPT_URL env variable is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Format WhatsApp as plain text (no leading + to avoid Sheets formula error)
    const waClean = whatsapp.replace(/^\+/, "");

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: readableTimestamp(),
        name,
        whatsapp: waClean,
        email,
        city: city || "",
        career,
        preferredLocation: preferredLocation || "Any",
        plan: plan || "",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Google Script error:", text);
      return NextResponse.json({ error: "Failed to save data" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
