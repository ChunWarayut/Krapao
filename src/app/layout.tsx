import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import AuthGuard from "@/components/auth/AuthGuard";
import { Prompt } from "next/font/google";

const promptFont = Prompt({
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krapao - กระเป๋าเงินอัจฉริยะ",
  description: "กระเป๋าเงินดิจิทัลที่ช่วยให้คุณเก็บเงินได้จริง",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScale: 0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark" suppressHydrationWarning>
      <body className={`${promptFont.variable} ${promptFont.className} antialiased bg-background text-foreground transition-colors duration-300`} suppressHydrationWarning>
        <div className="flex min-h-screen relative overflow-hidden">
          {/* Animated Background Mesh */}
          <div className="fixed inset-0 z-[-1] mesh-gradient opacity-20" />

          <AuthGuard>
            <Sidebar />
            <main className="flex-1 flex flex-col relative z-0">
              <Header />
              <div className="flex-1 p-6 lg:p-10 pb-32 lg:pb-10 max-w-7xl mx-auto w-full">
                {children}
              </div>
              <MobileNav />
              <ServiceWorkerRegistrar />
            </main>
          </AuthGuard>
        </div>
      </body>
    </html>
  );
}
