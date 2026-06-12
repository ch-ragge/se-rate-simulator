import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const URL_SELF = "https://ch-ragge.github.io/se-rate-simulator/";

export const metadata: Metadata = {
  metadataBase: new URL("https://ch-ragge.github.io/se-rate-simulator"),
  title: "フリーランスSE単価シミュレータ | 自分の市場価値を30秒で確認",
  description:
    "経験・スキル・工程を入力するだけで、フリーランスSEの市場単価の目安がわかる無料ツール。単価の決まり方や単価アップの具体策も解説。",
  alternates: { canonical: URL_SELF },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: URL_SELF,
    siteName: "らがSE",
    title: "フリーランスSE単価シミュレーター",
    description: "経験・スキル・工程から市場単価の目安がわかる無料ツール。完全ブラウザ完結・データ送信なし。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "フリーランスSE単価シミュレーター",
  url: URL_SELF,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description: "経験・スキル・工程からフリーランスSEの市場単価の目安を試算する無料ツール。",
  inLanguage: "ja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable}`}>{children}</body>
    </html>
  );
}
