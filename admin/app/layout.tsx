import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caffeine Admin - 관리자 대시보드",
  description: "Caffeine 앱 관리자 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
