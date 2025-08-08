import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['700'],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Lumen Voice",
  description: "Gerador de conteúdo com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-gray-deep text-white`}>
        {children}
      </body>
    </html>
  );
}