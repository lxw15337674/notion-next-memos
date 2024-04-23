import type { Metadata } from "next";
import "./globals.css";
import LeftSide from "@/components/LeftSide";
import { CssVarsProvider, getInitColorSchemeScript } from "@mui/joy";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: "next Memos",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await useMemoStore.getState().fetchMemos()
  // await useTagStore.getState().fetchTags()
  return (

    <html lang="en">
      <body>
        <CssVarsProvider
          defaultMode="dark"
        > <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <Toaster />
            <div className="h-full">
              <LeftSide />
              <div className="flex-1 ml-40 pl-6">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}
