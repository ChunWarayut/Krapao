import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import AuthGuard from "@/components/auth/AuthGuard";
import { Prompt } from "next/font/google";
import StructuredData from "@/components/seo/StructuredData";

const promptFont = Prompt({
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Krapao - กระเป๋าเงินอัจฉริยะ | จัดการรายรับรายจ่ายง่ายๆ",
    template: "%s | Krapao"
  },
  description: "Krapao (กระเป๋า) คือเว็บแอปพลิเคชันจัดการการเงินส่วนบุคคลแบบ Open Source ที่ออกแบบมาเพื่อคนทั่วไป เน้นความง่ายและความเป็นส่วนตัว ช่วยให้คุณจัดระเบียบกระเป๋าเงินได้ในไม่กี่คลิก",
  keywords: ["krapao", "กระเป๋า", "จัดการเงิน", "วางแผนการเงิน", "รายรับรายจ่าย", "สแกนใบเสร็จ", "บันทึกรายจ่าย", "ออมเงิน", "personal finance", "digital wallet", "OCR receipt", "glassmorphism UI"],
  authors: [{ name: "Krapao Team" }],
  openGraph: {
    title: "Krapao - กระเป๋าเงินอัจฉริยะ",
    description: "กระเป๋าเงินดิจิทัลที่ช่วยให้คุณเก็บเงินได้จริง จัดการทุกธุรกรรมได้ในที่เดียว",
    url: "https://krapao.app", // Adjust if needed
    siteName: "Krapao",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Krapao Logo",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krapao - กระเป๋าเงินอัจฉริยะ",
    description: "จัดการรายรับรายจ่ายง่ายๆ ด้วย Krapao สแกนใบเสร็จแล้วบันทึกอัตโนมัติ!",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "google-site-verification-placeholder", // User can replace this later
  },
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
        <StructuredData />
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
