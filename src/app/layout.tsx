import './globals.css';
import LeftSide from '@/components/LeftSide';
import { CssVarsProvider } from '@mui/joy';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import MobileHeader from '@/components/MobileHeader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html >
        <body>
          <CssVarsProvider defaultMode="dark">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            
            </ThemeProvider>
          </CssVarsProvider>
        </body>
      </html>
    </>
  );
}
