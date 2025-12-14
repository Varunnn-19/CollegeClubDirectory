"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Award, BookOpen, GraduationCap } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 pt-32">
      <div className="space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About BMS College of Engineering</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the vibrant student community and diverse clubs at one of India's premier engineering institutions.
          </p>
        </div>

        {/* College Information */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">BMS College of Engineering</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                BMS College of Engineering (BMSCE) is one of the oldest and most prestigious engineering colleges in Bangalore, Karnataka. 
                Established in 1946, BMSCE has been at the forefront of technical education in India for over seven decades.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The college is affiliated to Visvesvaraya Technological University (VTU) and is recognized by the All India Council for 
                Technical Education (AICTE). BMSCE offers undergraduate, postgraduate, and doctoral programs across various engineering 
                disciplines, computer applications, and management studies.
              </p>
              <div className="grid gap-4 md:grid-cols-3 pt-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Established</p>
                    <p className="text-sm text-muted-foreground">1946</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Accreditation</p>
                    <p className="text-sm text-muted-foreground">NAAC 'A' Grade</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Students</p>
                    <p className="text-sm text-muted-foreground">10,000+</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Student Clubs & Activities */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Student Clubs & Organizations</h2>
            <p className="text-muted-foreground">
              BMSCE boasts a vibrant ecosystem of student-run clubs and organizations that cater to diverse interests and passions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Technical Clubs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">
                  Clubs focused on technology, programming, robotics, and engineering innovation.
                </CardDescription>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Coding and Programming Clubs</li>
                  <li>• Robotics and Automation Societies</li>
                  <li>• Electronics and Hardware Clubs</li>
                  <li>• AI/ML and Data Science Groups</li>
                  <li>• Cybersecurity and Ethical Hacking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Cultural & Arts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">
                  Clubs celebrating creativity, culture, and artistic expression.
                </CardDescription>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Music and Dance Societies</li>
                  <li>• Drama and Theatre Groups</li>
                  <li>• Photography and Film Clubs</li>
                  <li>• Fine Arts and Design Clubs</li>
                  <li>• Literary and Debating Societies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle>Sports & Fitness</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">
                  Athletic clubs promoting physical fitness and competitive sports.
                </CardDescription>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cricket, Football, and Basketball</li>
                  <li>• Badminton and Table Tennis</li>
                  <li>• Athletics and Track Events</li>
                  <li>• Yoga and Fitness Groups</li>
                  <li>• Adventure and Outdoor Sports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle>Academic & Professional</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">
                  Clubs focused on academic excellence and professional development.
                </CardDescription>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• IEEE and Professional Societies</li>
                  <li>• Research and Innovation Clubs</li>
                  <li>• Entrepreneurship and Startups</li>
                  <li>• Quiz and Academic Competitions</li>
                  <li>• Career Development Groups</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Club Directory Purpose */}
        <section className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">About This Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                The BMS College Club Directory is a comprehensive platform designed to help students discover, explore, and join 
                various clubs and organizations on campus. Our mission is to foster a sense of community and make it easier for 
                students to find clubs that align with their interests and passions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through this platform, students can browse clubs by category, view upcoming events, read reviews from fellow students, 
                and directly connect with club administrators. Club leaders can manage their club information, post announcements, 
                organize events, and engage with their members.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're interested in technical innovation, cultural activities, sports, or academic pursuits, this directory 
                serves as your gateway to the vibrant student life at BMSCE.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
