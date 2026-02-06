import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@repo/ui/header";
import { Footer } from "@repo/ui/footer";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Blog",
  description: "A personal tech blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
