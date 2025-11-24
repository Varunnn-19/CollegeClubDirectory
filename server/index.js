import express from "express"
import cors from "cors"
import dotenv from "dotenv"
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

dotenv.config({ path: ".env.local" })
dotenv.config()

const app = express()

const allowedOrigins =
  process.env.CLIENT_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) || ["http://localhost:3000"]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)
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

const PORT = process.env.SERVER_PORT || 4000

async function start() {
  try {
    await connectDB()
    await seedClubs()
    app.listen(PORT, () => {
      console.log(`[Server] Listening on port ${PORT}`)
    })
  } catch (error) {
    console.error("[Server] Failed to start:", error)
    process.exit(1)
  }
}

start()

