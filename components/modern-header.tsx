"use client"

import Image from "next/image"
import Link from "next/link"
import { Bell } from "lucide-react"

export function ModernHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-white/60 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
        <Image src="/placeholder-logo.png" alt="Taskforce Logo" width={32} height={32} priority className="rounded" />
        <span className="hidden sm:inline">Taskforce</span>
      </Link>

      <button type="button" aria-label="Notifications" className="relative p-2 rounded-full hover:bg-gray-100">
        <Bell className="h-5 w-5 text-gray-600" />
        <span className="sr-only">알림</span>
      </button>
    </header>
  )
}

export default ModernHeader
