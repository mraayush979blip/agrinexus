import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AgriNexus AI | Future of Farming",
  description: "End-to-end AI ecosystem for the modern farmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow pb-32 pt-6 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto">
              {children}
            </main>
            <Navbar />
            
            {/* Google AI Hackathon Badge */}
            <div className="fixed top-6 right-4 md:right-8 lg:right-16 z-[60] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                  Powered by <span className="text-blue-600">Gemini</span>
                </span>
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
