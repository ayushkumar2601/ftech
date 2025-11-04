"use client"

import { useToast } from "./toast-provider"

export default function ToastDisplay() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass-effect rounded-lg p-4 border animate-slide-in-left transition-all ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10"
              : toast.type === "error"
                ? "border-destructive/30 bg-destructive/10"
                : "border-accent/30 bg-accent/10"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}</span>
              <p
                className={`text-sm ${
                  toast.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : toast.type === "error"
                      ? "text-destructive"
                      : "text-accent"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
