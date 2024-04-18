import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LeftSide from "@/components/LeftSide";
import { CssVarsProvider, getInitColorSchemeScript } from "@mui/joy";


export const metadata: Metadata = {
  title: "next Memos",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CssVarsProvider
      defaultMode="dark"
    >
      <html lang="en">
        <body>
          <div >
            <LeftSide />
            <div className="flex-1 ml-40 pl-6">
              {children}
            </div>
          </div>
        </body>
      </html>
    </CssVarsProvider>
  );
}
