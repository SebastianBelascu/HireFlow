"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasProfile, setHasProfile] = useState(true)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!jobTitle || !companyName || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          companyName,
          jobDescription,
        }),
      })

      if (response.status === 404) {
        setHasProfile(false)
        toast({
          title: "Profile not found",
          description: "Please upload your CV first to generate a cover letter",
          variant: "destructive",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to generate cover letter")
      }

      const data = await response.json()
      setCoverLetter(data.coverLetter)
    } catch (error) {
      console.error("Error generating cover letter:", error)
      toast({
        title: "Error",
        description: "Failed to generate cover letter",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    toast({
      title: "Copied to clipboard",
      description: "Cover letter has been copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Cover Letter Generator</h2>
        <p className="text-muted-foreground">
          Generate a personalized cover letter based on your profile and the job description
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the job details to generate a tailored cover letter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here..."
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !jobTitle || !companyName || !jobDescription}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
            <CardDescription>Your personalized cover letter will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasProfile ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload your CV first</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We need your CV to generate a personalized cover letter based on your skills and experience.
                </p>
                <Button asChild>
                  <a href="/profile/cv">Upload CV</a>
                </Button>
              </div>
            ) : coverLetter ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line">{coverLetter}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No cover letter generated yet</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the job details and click "Generate Cover Letter" to create a personalized cover letter.
                </p>
              </div>
            )}
          </CardContent>
          {coverLetter && (
            <CardFooter>
              <Button variant="outline" onClick={handleCopy} className="w-full">
                Copy to Clipboard
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

