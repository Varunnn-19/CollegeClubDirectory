import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "BMS College Club Directory",
  description: "Discover and join student clubs at BMS College of Engineering",
  generator: "Next.js",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#fdfceb', minHeight: '100vh', margin: 0 }}>
        <SiteHeader />
        <div className="min-h-[calc(100vh-160px)]" style={{ backgroundColor: '#fdfceb' }}>{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
