import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stillroom — Words From Your Comfort Character",
  description: "A quiet, private space to receive a few comforting words from a favorite fictional character.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
