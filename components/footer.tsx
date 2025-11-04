"use client"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-t from-secondary/30 to-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center glow-effect">
                <span className="text-accent-foreground font-bold text-sm">⛓</span>
              </div>
              <span className="font-bold text-foreground">ForeChain</span>
            </div>
            <p className="text-muted-foreground text-sm">Blockchain-powered forensic investigation platform</p>
          </div>

          {/* Links */}
          <div className="animate-fade-in-up [animation-delay:100ms]">
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="animate-fade-in-up [animation-delay:200ms]">
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors glow-effect p-2 rounded-lg"
              >
                <span className="text-xl">𝕏</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors glow-effect p-2 rounded-lg"
              >
                <span className="text-xl">🔗</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors glow-effect p-2 rounded-lg"
              >
                <span className="text-xl">💬</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            <strong>Disclaimer:</strong> ForeChain is a blockchain-based forensic platform designed for evidence
            verification and tamper detection. All data is processed securely on immutable ledgers. Users assume full
            responsibility for compliance with applicable laws and regulations.
          </p>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; 2025 ForeChain. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
