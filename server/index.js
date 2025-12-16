// Backend fixed and ready - Dec 15, 2025 11:00 PM
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import connectDB from "./config/db.js"
import seedClubs from "./seed/seedClubs.js"
import authRoutes from "./routes/auth.js"
import clubsRoutes from "./routes/clubs.js"
import membershipsRoutes from "./routes/memberships.js"
import eventsRoutes from "./routes/events.js"
import rsvpsRoutes from "./routes/rsvps.js"
import announcementsRoutes from "./routes/announcements.js"
import reviewsRoutes from "./routes/reviews.js"
import messagesRoutes from "./routes/messages.js"

const ENV_FILES = [".env", ".env.local", "database.env"]

for (const file of ENV_FILES) {
  const fullPath = path.resolve(process.cwd(), file)
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: true })
  }
}

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  "https://collegeclubdirectoryv1.vercel.app",
  "https://collegeclubdirectoryv1-owsypnd7-varun-s-projects-56b448f5.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // IMPORTANT
  })
);

// VERY IMPORTANT
app.options("*", cors());


app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() })
})

app.use("/api/users", authRoutes)
app.use("/api/clubs", clubsRoutes)
app.use("/api/memberships", membershipsRoutes)
app.use("/api/events", eventsRoutes)
app.use("/api/rsvps", rsvpsRoutes)
app.use("/api/announcements", announcementsRoutes)
app.use("/api/reviews", reviewsRoutes)
app.use("/api/messages", messagesRoutes)

app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err)
  res.status(err.status || 500).json({ message: err.message || "Something went wrong." })
})

const PORT = process.env.PORT || 4000


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Database connection failed:", err)
    process.exit(1)
  })
