"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CVUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setFile(file)
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    // Create form data
    const formData = new FormData()
    formData.append("cv", file)

    try {
      const response = await fetch("/api/profile/cv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload CV")
      }

      toast({
        title: "CV uploaded successfully",
        description: "Your CV has been analyzed and your profile has been updated",
      })

      router.push("/profile")
      router.refresh()
    } catch (error) {
      console.error("Error uploading CV:", error)
      toast({
        title: "Error uploading CV",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upload CV</h2>
        <p className="text-muted-foreground">Upload your CV to get personalized job recommendations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CV Upload</CardTitle>
          <CardDescription>Upload your CV in PDF or DOCX format</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag and drop your CV here</h3>
                <p className="text-sm text-muted-foreground mb-4">Supports PDF and DOCX files up to 5MB</p>
                <Button variant="outline" onClick={() => document.getElementById("cv-upload")?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
                <input id="cv-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-4" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload CV"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

