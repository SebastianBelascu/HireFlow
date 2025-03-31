import type React from "react"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return <>{children}</>
}

