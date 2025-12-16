"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, User, Shield, HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 pt-32">
      <div className="space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us for support, questions, or feedback about the Club Directory.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>General Inquiries</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                For general questions about the Club Directory platform, features, or how to use the system.
              </p>
              <div className="pt-2">
                <a 
                  href="mailto:clubdirectory@bmsce.ac.in" 
                  className="text-primary hover:underline font-medium"
                >
                  clubdirectory@bmsce.ac.in
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Page Administrator</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Contact the page administrator for club approval requests, account issues, or technical support.
              </p>
              <div className="pt-2">
                <a 
                  href="mailto:admin@bmsce.ac.in" 
                  className="text-primary hover:underline font-medium"
                >
                  admin@bmsce.ac.in
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Response time: Within 24-48 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Club Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                For questions about creating a new club, managing existing clubs, or club-related issues.
              </p>
              <div className="pt-2">
                <a 
                  href="mailto:clubs@bmsce.ac.in" 
                  className="text-primary hover:underline font-medium"
                >
                  clubs@bmsce.ac.in
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>Technical Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Report bugs, technical issues, or request new features for the platform.
              </p>
              <div className="pt-2">
                <a 
                  href="mailto:support@bmsce.ac.in" 
                  className="text-primary hover:underline font-medium"
                >
                  support@bmsce.ac.in
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* College Contact Information */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">BMS College of Engineering</CardTitle>
              <CardDescription>Official college contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-muted-foreground">
                      P.O. Box No. 1908, Bull Temple Road,<br />
                      Basavanagudi, Bangalore - 560 019<br />
                      Karnataka, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      +91-80-26622130-35<br />
                      +91-80-26614357
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:info@bmsce.ac.in" className="text-primary hover:underline">
                        info@bmsce.ac.in
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Website</p>
                    <p className="text-sm text-muted-foreground">
                      <a 
                        href="https://www.bmsce.ac.in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        www.bmsce.ac.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Link href="/create-club">
                  <Button variant="outline" className="w-full justify-start">
                    Create a New Club
                  </Button>
                </Link>
                <Link href="/clubs">
                  <Button variant="outline" className="w-full justify-start">
                    Browse All Clubs
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" className="w-full justify-start">
                    Create an Account
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full justify-start">
                    Sign In to Your Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">How do I create a new club?</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up for an account, then navigate to "Create Club" in the header. Fill out the club information 
                  and submit for approval. The page administrator will review and approve your club request.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Who can approve club requests?</h3>
                <p className="text-sm text-muted-foreground">
                  Only designated page administrators with admin privileges can approve or reject club requests. 
                  If you need admin access, please contact the page administrator.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Can I join multiple clubs?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Students can join as many clubs as they want. Simply browse the clubs directory and click 
                  "Join Club" on any club you're interested in.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">How do I contact a specific club?</h3>
                <p className="text-sm text-muted-foreground">
                  Visit the club's detail page to find their contact email and social media links. You can also 
                  send messages through the platform if you're logged in.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
