import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { LanguageProvider } from "@/lib/i18n/client";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "CRM SaaS — El CRM moderno para ventas",
    template: "%s | CRM SaaS",
  },
  description: "El CRM flexible para equipos de ventas modernos. Administra contactos, negocios y pipeline con inteligencia artificial.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = ((await cookies()).get("lang")?.value ?? "es") as Lang;

  return (
    <html lang={lang} className="dark">
      <body className={`${inter.variable} font-sans antialiased`} style={{ backgroundColor: "#0a0a0f" }}>
        <QueryProvider>
          <LanguageProvider initialLang={lang}>
            {children}
            <Toaster />
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
