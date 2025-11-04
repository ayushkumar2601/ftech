"use client"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="group glass-effect glass-effect-hover rounded-2xl p-6 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/30 dark:to-primary/30 text-accent text-xl flex items-center justify-center mb-4 group-hover:from-accent/40 group-hover:to-primary/40 transition-all duration-300 glow-effect">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

      {/* Bottom gradient line */}
      <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-accent via-primary to-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-transparent transition-all duration-500 rounded-full" />
    </div>
  )
}
