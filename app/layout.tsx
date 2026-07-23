import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "LeadFlow AI", template: "%s | LeadFlow AI" },
  description: "Assistente pessoal de prospecção e gestão de leads.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body>
        <div className="min-h-screen bg-slate-50 text-slate-950">
          <AppSidebar />
          <div className="lg:pl-72">
            <AppHeader />
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
