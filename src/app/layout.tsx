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
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
