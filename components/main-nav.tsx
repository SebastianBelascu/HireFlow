"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BriefcaseBusiness } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="flex items-center space-x-2 font-medium transition-colors">
        <BriefcaseBusiness className="h-6 w-6 text-primary" />
        <span className="font-bold">JobMatch AI</span>
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/jobs"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/jobs" || pathname.startsWith("/jobs/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Browse Jobs
      </Link>
      <Link
        href="/applications"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/applications" ? "text-primary" : "text-muted-foreground",
        )}
      >
        My Applications
      </Link>
    </nav>
  )
}

