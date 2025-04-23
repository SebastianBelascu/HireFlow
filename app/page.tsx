import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, FileText, Sparkles, Send, CheckCircle, Star, Code } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container flex flex-wrap items-center justify-between py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HireFlow</span>
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
        {/* Hero Section */}
        <section className="py-12 md:py-24 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Job Matching</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none max-w-4xl">
                  Find Your Dream Job with AI Precision
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-base sm:text-lg/relaxed xl:text-xl/relaxed">
                  HireFlow uses artificial intelligence to match your skills with the perfect job and generate tailored cover letters that get you noticed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">
                      See How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[560px] xl:max-w-[640px] aspect-video rounded-xl bg-gradient-to-br from-background via-muted to-muted/80 p-8 shadow-xl border overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-2 text-lg font-medium mb-6">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>AI-Powered Job Matching</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Smart CV Analysis</p>
                          <p className="text-sm text-muted-foreground">Our AI extracts your skills and experience</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Personalized Job Matches</p>
                          <p className="text-sm text-muted-foreground">Tailored to your unique profile</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Send className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">AI Cover Letter Generator</p>
                          <p className="text-sm text-muted-foreground">Customized for each application</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 md:py-20 bg-background">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                  Three Simple Steps to Your Next Career Move
                </h2>
                <p className="text-muted-foreground text-base md:text-lg/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform streamlines your job search from start to finish.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-6 md:gap-8 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <Card className="relative overflow-hidden border-2 border-muted bg-background/50 transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
                <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-primary font-bold">1</div>
                  <h3 className="text-xl font-bold">Upload Your CV</h3>
                  <p className="text-muted-foreground">
                    Upload your resume in any format. Our AI will analyze your skills, experience, and qualifications.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-2 border-muted bg-background/50 transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
                <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-primary font-bold">2</div>
                  <h3 className="text-xl font-bold">Get Job Matches</h3>
                  <p className="text-muted-foreground">
                    Our AI matches your profile with available job listings to find opportunities that fit your skills.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-2 border-muted bg-background/50 transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
                <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-primary font-bold">3</div>
                  <h3 className="text-xl font-bold">Generate Cover Letters</h3>
                  <p className="text-muted-foreground">
                    Create personalized cover letters for each application with our AI generator and apply with confidence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Recommendation Feature Highlight */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative rounded-xl overflow-hidden shadow-xl border bg-background/80 p-1 max-w-[640px] mx-auto lg:ml-0">
                  <div className="rounded-lg overflow-hidden bg-muted/30 p-4 md:p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="ml-2 text-xs text-muted-foreground">AI Job Recommendation</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <div className="text-sm">
                            <span className="font-medium">Senior Frontend Developer</span>
                            <span className="text-muted-foreground"> - 94% match</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <div className="text-sm">
                            <span className="font-medium">React Developer</span>
                            <span className="text-muted-foreground"> - 91% match</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <div className="text-sm">
                            <span className="font-medium">UI/UX Developer</span>
                            <span className="text-muted-foreground"> - 87% match</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-xs text-muted-foreground">
                            Based on your skills: React, TypeScript, Next.js, Tailwind CSS, UI/UX Design
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Job Matching</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Smart Job Recommendations</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Our advanced AI algorithm analyzes your resume and compares it with thousands of job listings to find the perfect matches.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Skills-based matching for higher relevance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Personalized match percentage for each job</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Daily updates with new matching opportunities</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/register">
                    <Button className="gap-2">
                      Try Job Matching
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Letter Generator Highlight */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Send className="h-3.5 w-3.5" />
                  <span>AI Cover Letter Generator</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Personalized Cover Letters in Seconds</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Stand out from the crowd with tailored cover letters that highlight your relevant skills and experience for each job application.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Customized for each job application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Highlights your most relevant experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>Professional tone with perfect grammar</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/register">
                    <Button className="gap-2">
                      Generate a Cover Letter
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div>
                <div className="relative rounded-xl overflow-hidden shadow-xl border bg-background/80 p-1 max-w-[640px] mx-auto">
                  <div className="rounded-lg overflow-hidden bg-muted/30 p-4 md:p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="ml-2 text-xs text-muted-foreground">AI Cover Letter</div>
                      </div>
                      <div className="space-y-3 font-mono text-sm">
                        <p>Dear Hiring Manager,</p>
                        <p>
                          I am writing to express my interest in the <span className="text-primary">Senior Frontend Developer</span> position at <span className="text-primary">TechCorp</span>. With over 5 years of experience in React and TypeScript development, I am confident in my ability to contribute to your team.
                        </p>
                        <p>
                          My experience with <span className="text-primary">Next.js</span> and <span className="text-primary">Tailwind CSS</span> aligns perfectly with your requirements, and I have successfully delivered...
                        </p>
                        <p className="text-muted-foreground">[Preview truncated]</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                  What Our Users Say
                </h2>
                <p className="max-w-[700px] text-muted-foreground text-base md:text-lg/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of job seekers who have found their dream jobs using HireFlow.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-6xl mx-auto">
              <Card className="bg-background/50 border-2">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                    </div>
                    <p className="text-lg italic">
                      "The AI job matching was spot on! I found a position that perfectly matched my skills, and the cover letter generator helped me land an interview within a week."
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-semibold text-primary">JD</span>
                      </div>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-muted-foreground">Frontend Developer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50 border-2">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                    </div>
                    <p className="text-lg italic">
                      "After months of job searching, HireFlow's AI recommendations led me to a position I wouldn't have found otherwise. The personalized cover letter sealed the deal!"
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-semibold text-primary">JS</span>
                      </div>
                      <div>
                        <p className="font-semibold">Jane Smith</p>
                        <p className="text-sm text-muted-foreground">UX Designer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-lg border bg-background/50 px-4 py-2 text-sm">
                <span className="font-semibold text-primary">94%</span>
                <span>of our users find a relevant job match within 2 weeks</span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                Ready to Transform Your Job Search?
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-[800px]">
                Join thousands of job seekers who have found their dream jobs with HireFlow's AI-powered job matching and cover letter generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">No credit card required</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HireFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered job matching and cover letter generation to help you land your dream job.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/testimonials" className="hover:text-primary">Testimonials</Link></li>
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} HireFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
