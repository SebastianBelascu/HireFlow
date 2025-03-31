"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useSidebar } from "./sidebar-provider"
import Link from "next/link"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Sheet, SheetContent } from "./ui/sheet"
import { useSession } from "next-auth/react"
import {
  BarChart3,
  Bookmark,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  User,
  Sparkles,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, toggle, close } = useSidebar()
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === "ADMIN"

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Browse Jobs",
      icon: BriefcaseBusiness,
      href: "/jobs",
      active: pathname === "/jobs" || pathname.startsWith("/jobs/"),
    },
    {
      label: "AI Recommendations",
      icon: Sparkles,
      href: "/recommendations",
      active: pathname === "/recommendations",
    },
    {
      label: "My Bookmarks",
      icon: Bookmark,
      href: "/bookmarks",
      active: pathname === "/bookmarks",
    },
    {
      label: "Cover Letter Generator",
      icon: FileText,
      href: "/cover-letter",
      active: pathname === "/cover-letter",
    },
    {
      label: "My Applications",
      icon: ClipboardList,
      href: "/applications",
      active: pathname === "/applications",
    },
    {
      label: "My Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile",
    },
    {
      label: "Upload CV",
      icon: FileText,
      href: "/profile/cv",
      active: pathname === "/profile/cv",
    },
  ]

  const adminRoutes = [
    {
      label: "Admin Dashboard",
      icon: BarChart3,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Manage Jobs",
      icon: BriefcaseBusiness,
      href: "/admin/jobs",
      active: pathname === "/admin/jobs" || pathname.startsWith("/admin/jobs/"),
    },
    {
      label: "Applications",
      icon: ClipboardList,
      href: "/admin/applications",
      active: pathname === "/admin/applications",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <>
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full py-6">
            <div className="flex items-center gap-2 px-4 py-2">
              <BriefcaseBusiness className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">JobMatch AI</span>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Button
                    key={route.href}
                    variant={route.active ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={route.href} onClick={close}>
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            {isAdmin && (
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin</h2>
                <div className="space-y-1">
                  {adminRoutes.map((route) => (
                    <Button
                      key={route.href}
                      variant={route.active ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={route.href} onClick={close}>
                        <route.icon className="mr-2 h-4 w-4" />
                        {route.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className={cn("hidden border-r bg-background lg:block", className)}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BriefcaseBusiness className="h-6 w-6 text-primary" />
              <span>JobMatch AI</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-2">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Button
                    key={route.href}
                    variant={route.active ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={route.href}>
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            {isAdmin && (
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin</h2>
                <div className="space-y-1">
                  {adminRoutes.map((route) => (
                    <Button
                      key={route.href}
                      variant={route.active ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={route.href}>
                        <route.icon className="mr-2 h-4 w-4" />
                        {route.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      <div className="flex h-14 items-center px-4 lg:hidden">
        <Button variant="outline" size="icon" className="mr-2" onClick={toggle}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BriefcaseBusiness className="h-6 w-6 text-primary" />
          <span>JobMatch AI</span>
        </Link>
      </div>
    </>
  )
}

