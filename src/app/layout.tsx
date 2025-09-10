import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.scss";

export const poppins = Poppins({
  subsets: ["latin"],        // Choose subsets you need
  weight: ["400", "500", "600", "700"], // Select the weights you will use
  variable: "--font-poppins" // Optional: create a CSS variable
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
    <html lang="en">
      <body
        className={`${poppins.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
