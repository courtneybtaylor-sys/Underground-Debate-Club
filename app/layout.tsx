import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Underground Debate Club",
  description: "Challenge your mind. Master your arguments. Rise in the ranks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
