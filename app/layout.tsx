import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif} from "next/font/google";
import "./globals.css";

const InterSans = Inter({
  variable: "--font-Inter-sans",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  weight: ['400','700'],
  subsets: ["latin"],
  variable:'--font-ibm-plex-serif'
});

export const metadata: Metadata = {
  title: "Horizon",
  description: "Horizon is a modern banking platform ",
  icons:{
    icon:'./icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${InterSans.variable} ${ibmPlexSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
