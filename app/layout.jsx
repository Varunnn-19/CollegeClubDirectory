import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CursorEffects } from "@/components/cursor-effects"
import { Suspense } from "react"

export const metadata = {
  title: "BMS College Club Directory",
  description: "Explore student clubs and communities at BMS College of Engineering",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <CursorEffects />
            <SiteHeader />
            <div className="min-h-[calc(100vh-160px)] transition-colors duration-300 pt-[168px]">
              {children}
            </div>
            <SiteFooter />
            <ScrollToTop />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
