import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token DApp",
  description: "Send & request ERC20 tokens",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
