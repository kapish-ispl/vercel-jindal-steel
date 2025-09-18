import { Suspense } from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import AppContextProvider from '@/context/AppContext';
import "@/styles/globals.scss";
import 'aos/dist/aos.css';
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});


export const metadata: Metadata = {
  title: "JSP",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable}`}
      >
        <Suspense fallback={null}>
          <AppContextProvider>
            <Header />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main>
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </AppContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
