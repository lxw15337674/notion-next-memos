import type { Metadata } from 'next';
import './globals.css';
import LeftSide from '@/components/LeftSide';
import { CssVarsProvider } from '@mui/joy';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import MobileHeader from '@/components/MobileHeader';

export const metadata: Metadata = {
  title: 'memos',
  description: 'memos by notion api',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssVarsProvider defaultMode="dark">
          {' '}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <div className="h-full">
              <MobileHeader />
              <LeftSide />
              <div className="flex-1 md:ml-40 md:pl-6 px-4">{children}</div>
            </div>
          </ThemeProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}
