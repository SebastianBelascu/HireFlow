"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface BookmarkButtonProps {
  jobId: string
}

export function BookmarkButton({ jobId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch("/api/bookmarks")

        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks")
        }

        const data = await response.json()
        const bookmarkedJobs = data.bookmarks || []

        setIsBookmarked(bookmarkedJobs.some((job: any) => job.id === jobId))
      } catch (error) {
        console.error("Error checking bookmark status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkBookmarkStatus()
  }, [jobId])

  const handleToggleBookmark = async () => {
    setIsUpdating(true)

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/${jobId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to remove bookmark")
        }

        setIsBookmarked(false)
        toast({
          title: "Bookmark removed",
          description: "Job has been removed from your bookmarks",
        })
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to bookmark job")
        }

        setIsBookmarked(true)
        toast({
          title: "Job bookmarked",
          description: "Job has been added to your bookmarks",
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Bookmark className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    )
  }

  return (
    <Button variant={isBookmarked ? "default" : "outline"} onClick={handleToggleBookmark} disabled={isUpdating}>
      <Bookmark className="mr-2 h-4 w-4" />
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  )
}

