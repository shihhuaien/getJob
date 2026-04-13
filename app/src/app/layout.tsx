import type { Metadata } from "next";
import { Noto_Sans_TC, Geist_Mono } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Offery - 智慧求職平台",
  description:
    "AI 驅動的求職工具，幫助你追蹤職缺、優化履歷、準備面試，讓求職效率提升 58%。",
  keywords: ["求職", "履歷", "面試", "職缺追蹤", "AI 履歷", "台灣求職"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSansTC.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-noto-sans-tc)]">
        {children}
      </body>
    </html>
  );
}
