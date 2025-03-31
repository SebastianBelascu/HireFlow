import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, FileText, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">JobMatch AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Your Perfect Job Match with AI</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Upload your CV and let our AI-powered system match you with the most relevant job opportunities. Get
                  personalized recommendations based on your skills and experience.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl bg-muted/50 p-6 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>AI-Powered Recommendations</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <p className="font-medium">Upload your CV</p>
                          <p className="text-sm text-muted-foreground">Our AI analyzes your skills and experience</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <p className="font-medium">Get personalized recommendations</p>
                          <p className="text-sm text-muted-foreground">Matched to your profile and preferences</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BriefcaseBusiness className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <p className="font-medium">Apply with confidence</p>
                          <p className="text-sm text-muted-foreground">To jobs that match your qualifications</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple Process, Powerful Results
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered job board makes it easy to find the perfect job match in just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Upload Your CV</h3>
                <p className="text-muted-foreground">
                  Upload your CV in PDF or DOCX format. Our system will extract your skills, experience, and
                  qualifications.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your profile and compares it with available job listings to find the best matches.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BriefcaseBusiness className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Apply to Jobs</h3>
                <p className="text-muted-foreground">
                  Review your personalized job recommendations and apply to the ones that interest you with just a
                  click.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-primary" />
            <span className="font-semibold">JobMatch AI</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} JobMatch AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

