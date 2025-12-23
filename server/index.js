import "./env.js"
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"

import authRoutes from "./routes/auth.js"
import clubsRoutes from "./routes/clubs.js"
import membershipsRoutes from "./routes/memberships.js"
import eventsRoutes from "./routes/events.js"
import rsvpsRoutes from "./routes/rsvps.js"
import announcementsRoutes from "./routes/announcements.js"
import reviewsRoutes from "./routes/reviews.js"

const app = express()

/* =====================
   BODY PARSERS (MUST BE FIRST)
===================== */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* =====================
   CORS (FINAL FIX)
===================== */
app.use(
  cors({
    origin: true, // ✅ allow ALL origins (Vercel previews included)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-approver-email",
    ],
  })
)

app.options("*", cors())

/* =====================
   HEALTH CHECK
===================== */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
  })
})

/* =====================
   ROUTES
===================== */
app.use("/api/users", authRoutes)
app.use("/api/clubs", clubsRoutes)
app.use("/api/memberships", membershipsRoutes)
app.use("/api/events", eventsRoutes)
app.use("/api/rsvps", rsvpsRoutes)
app.use("/api/announcements", announcementsRoutes)
app.use("/api/reviews", reviewsRoutes)

/* =====================
   ERROR HANDLER (JSON ONLY)
===================== */
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err)
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  })
})

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err)
    process.exit(1)
  })
