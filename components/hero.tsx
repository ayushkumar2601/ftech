"use client"

export default function Hero() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-primary/3 dark:from-accent/10 dark:via-transparent dark:to-primary/5 pointer-events-none" />

      {/* Grid background effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,150,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,150,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(79,235,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,235,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge with animation */}
        <div className="inline-block mb-6 px-4 py-2 rounded-full glass-effect glass-effect-hover animate-fade-in-up">
          <span className="text-accent text-sm font-medium">🔐 Blockchain Verified</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up [animation-delay:100ms]">
          ForeChain{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary dark:from-cyan-400 dark:to-blue-400">
            — Trust Through Transparency
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
          Blockchain-powered forensic ledger for secure evidence verification.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up [animation-delay:300ms]">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-accent to-primary text-accent-foreground hover:shadow-lg transition-all font-semibold text-base glow-effect hover:scale-105 transform">
            Connect Wallet
          </button>
          <button className="px-8 py-3 rounded-full glass-effect glass-effect-hover text-accent font-semibold text-base border-2 border-accent/30 hover:border-accent transition-all glow-effect">
            Go to Dashboard
          </button>
        </div>

        {/* Subtext */}
        <p className="text-muted-foreground text-sm mt-8 animate-fade-in-up [animation-delay:400ms]">
          Empowering forensic investigations with immutable blockchain verification
        </p>
      </div>
    </section>
  )
}
