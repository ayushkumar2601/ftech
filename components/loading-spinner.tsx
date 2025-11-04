"use client"

export default function LoadingSpinner() {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
    </div>
  )
}
