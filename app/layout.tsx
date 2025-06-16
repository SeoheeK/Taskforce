import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ModernSidebar } from "@/components/modern-sidebar"
import { ModernHeader } from "@/components/modern-header"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taskforce - AI 협업 플랫폼",
  description: "AI 페르소나들이 협업하여 복잡한 문제를 해결하는 지능형 에이전트 플랫폼",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global ResizeObserver error handler
              window.addEventListener('error', function(e) {
                if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="flex h-screen bg-gray-50">
            <ModernSidebar />
            <div className="flex-1 flex flex-col ml-16">
              <ModernHeader />
              <main className="flex-1 overflow-auto">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
