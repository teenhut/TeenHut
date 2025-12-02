import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

const debata = localFont({
  src: "../public/fonts/Debata-Regular.otf",
  variable: "--font-debata",
});

export const metadata: Metadata = {
  title: "Teen Hut",
  description: "A community for teens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${debata.variable}`}>
        <AuthProvider>
          <AuthGuard>
            <div className="flex min-h-screen bg-white">
              <Sidebar />
              <main className="flex-1 overflow-y-auto h-screen">
                {children}
              </main>
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
