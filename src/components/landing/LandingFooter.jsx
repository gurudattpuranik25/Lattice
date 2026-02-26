export default function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#818CF8"/>
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M16 8V24" stroke="white" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
            </svg>
            <span className="text-zinc-600 text-sm">&copy; 2026 Lattice</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Terms</a>
          </div>

          <span className="text-zinc-600 text-sm">Made with Claude AI + React</span>
        </div>
      </div>
    </footer>
  );
}
