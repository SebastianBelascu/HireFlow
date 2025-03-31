"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewJobPage() {
  const [title, setTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")
  const [jobType, setJobType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          companyName,
          location,
          description,
          requiredSkills: skills,
          salaryMin: salaryMin ? Number.parseInt(salaryMin) : null,
          salaryMax: salaryMax ? Number.parseInt(salaryMax) : null,
          jobType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create job")
      }

      toast({
        title: "Job created",
        description: "Your job listing has been created successfully",
      })

      router.push("/admin/jobs")
      router.refresh()
    } catch (error) {
      console.error("Error creating job:", error)
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Post New Job</h2>
        <p className="text-muted-foreground">Create a new job listing for candidates to apply</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the details of the job listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={location} onValueChange={setLocation} required>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={jobType} onValueChange={setJobType} required>
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary (Optional)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="e.g. 50000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary (Optional)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="e.g. 80000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Enter job description..."
                className="min-h-[200px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  placeholder="e.g. React"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

