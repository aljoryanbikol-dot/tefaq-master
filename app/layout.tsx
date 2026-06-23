import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEFAQ Master - Préparation à l'examen de français",
  description: "Préparez-vous au TEFAQ avec l'aide de l'IA.",
  keywords: "TEFAQ, français, Québec, immigration, CEFR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: "12px", fontSize: "14px" } }} />
      </body>
    </html>
  );
}
