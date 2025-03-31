"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ApplyButtonProps {
  jobId: string
  disabled: boolean
  hasCV: boolean
}

export function ApplyButton({ jobId, disabled, hasCV }: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleApply = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to apply")
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      })

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error applying for job:", error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasCV) {
    return (
      <Button asChild>
        <Link href="/profile/cv">Upload CV to Apply</Link>
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Apply Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Application</DialogTitle>
          <DialogDescription>
            Are you sure you want to apply for this job? Your CV and profile information will be shared with the
            employer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

