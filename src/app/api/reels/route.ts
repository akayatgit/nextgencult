import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const reelsDir = path.join(process.cwd(), "public", "reels");

  try {
    const files = fs.readdirSync(reelsDir);
    const images = files
      .filter((f) => /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}
