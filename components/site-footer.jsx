export function SiteFooter() {
  return (
    <footer 
      className="mt-12 border-t"
      style={{ 
        backgroundColor: '#fdfceb',
        borderColor: '#9fdcc8'
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p 
              className="font-medium"
              style={{ color: '#22112a' }}
            >
              College Club Directory
            </p>
            <p 
              className="text-sm"
              style={{ color: '#4a3a4f' }}
            >
              Connecting students with communities.
            </p>
          </div>
          <div 
            className="text-sm"
            style={{ color: '#4a3a4f' }}
          >
            © {new Date().getFullYear()} BMS College of Engineering. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
