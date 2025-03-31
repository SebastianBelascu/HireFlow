import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar className="w-64" />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
            <div className="flex flex-1 items-center justify-end">
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

