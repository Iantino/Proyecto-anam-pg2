import type { Metadata } from "next";
import { Lora, Work_Sans } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/conditional-header";
import ConditionalFooter from "@/components/conditional-footer";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanpablojocopilas.gob.gt"),
  title: "Municipalidad de San Pablo Jocopilas",
  description:
    "Sitio informativo de la Municipalidad de San Pablo Jocopilas, Suchitepéquez, Guatemala: trámites municipales, información del municipio y contacto.",
  openGraph: {
    title: "Municipalidad de San Pablo Jocopilas",
    description:
      "Trámites municipales, información del municipio y contacto de la Municipalidad de San Pablo Jocopilas, Suchitepéquez.",
    images: ["/images/og-image.png"],
    locale: "es_GT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${lora.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F3] font-(family-name:--font-work-sans) text-[#1B2420]">
        <ConditionalHeader />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
