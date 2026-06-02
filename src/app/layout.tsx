import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
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
  title: "Bible Memo - 미니멀 성경 암송",
  description: "말씀을 삶에 체화하는 경험",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bible Memo",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30">
        <PwaRegister />
        <div className="w-full h-[100dvh] max-w-md mx-auto overflow-x-hidden overflow-y-auto relative bg-black shadow-2xl flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
