"use client"

import FeatureCard from "./feature-card"

const features = [
  {
    title: "Evidence Authentication",
    description:
      "Cryptographically sign and verify evidence on the blockchain to ensure authenticity and prevent tampering.",
    icon: "✓",
  },
  {
    title: "Tamper Detection",
    description: "Automatically detect and flag any unauthorized modifications to evidence records in real-time.",
    icon: "⚠",
  },
  {
    title: "Blockchain Ledger",
    description:
      "Immutable, transparent ledger providing complete audit trails of all evidence handling and verification.",
    icon: "⛓",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-accent/3 dark:via-primary/5 dark:to-accent/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Secure Evidence Verification
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security for forensic investigations
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
