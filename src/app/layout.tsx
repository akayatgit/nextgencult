import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NG Cult | IT Career Counselling & Personalized Tech Roadmaps",
  description:
    "Get IT career counselling with a personalized roadmap based on your skills, time, strengths, and market demand. Avoid wrong course choices. Book ₹99 consult.",
  keywords: [
    "IT career counselling",
    "tech career guidance",
    "personalized career roadmap",
    "career assessment for students",
    "course selection guidance",
    "IT career roadmap India",
    "career consultation for students",
    "guidance before choosing a course",
    "career confusion help",
  ],
  openGraph: {
    title: "NG Cult | IT Career Counselling & Personalized Tech Roadmaps",
    description:
      "Get IT career counselling with a personalized roadmap based on your skills, time, strengths, and market demand. Avoid wrong course choices. Book ₹99 consult.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "NG Cult | IT Career Counselling & Personalized Tech Roadmaps",
    description:
      "Get IT career counselling with a personalized roadmap based on your skills, time, strengths, and market demand. Avoid wrong course choices. Book ₹99 consult.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
