import type { Metadata, Viewport } from "next";
import { Poppins, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Shahzaib Iqbal — Full Stack Developer",
  description: "Portfolio of Shahzaib Iqbal, Full Stack Developer from Karachi, Pakistan.",
};
export const viewport: Viewport = { themeColor: "#030304", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
