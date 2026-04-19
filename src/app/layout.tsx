import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "フリーランスSE単価シミュレータ | 自分の市場価値を30秒で確認",
  description:
    "経験・スキル・工程を入力するだけで、フリーランスSEの市場単価の目安がわかる無料ツール。元自衛隊×フリーランスSE13年のリアルな相場感をもとに算出。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
