import Club from "../models/Club.js"
import asyncHandler from "../utils/asyncHandler.js"

const sampleClubs = [
  {
    name: "AI & Machine Learning Club",
    slug: "ai-ml-club",
    description: JSON.stringify({
      shortDescription: "Explore AI and ML technologies",
      fullDescription: "Dive deep into artificial intelligence and machine learning with hands-on projects and workshops.",
      membershipType: "Open to all students",
      contactEmail: "ai-club@bmsce.ac.in",
      meetingTimes: "Every Friday, 4:00 PM"
    }),
    category: "Technical",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    status: "approved",
    createdBy: "admin"
  },
  {
    name: "Photography Club",
    slug: "photography-club", 
    description: JSON.stringify({
      shortDescription: "Capture moments through lens",
      fullDescription: "Learn photography techniques and explore visual storytelling.",
      membershipType: "Open to all students",
      contactEmail: "photo-club@bmsce.ac.in",
      meetingTimes: "Every Wednesday, 3:30 PM"
    }),
    category: "Creative",
    image: "https://images.unsplash.com/photo-1516035069371-cffa231fd1a1a?w=800&h=600&fit=crop",
    status: "approved",
    createdBy: "admin"
  },
  {
    name: "Debate Club",
    slug: "debate-club",
    description: JSON.stringify({
      shortDescription: "Sharpen your argumentation skills",
      fullDescription: "Practice public speaking and critical thinking through debates and discussions.",
      membershipType: "Open to all students", 
      contactEmail: "debate-club@bmsce.ac.in",
      meetingTimes: "Every Tuesday, 5:00 PM"
    }),
    category: "Academic",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    status: "approved",
    createdBy: "admin"
  }
]

export async function seedClubs() {
  try {
    // Clear existing clubs
    await Club.deleteMany({})
    
    // Insert sample clubs
    const clubs = await Club.create(sampleClubs)
    console.log(`✅ Seeded ${clubs.length} clubs successfully`)
    
    return { success: true, count: clubs.length, clubs }
  } catch (error) {
    console.error('❌ Error seeding clubs:', error)
    return { success: false, error: error.message }
  }
}
