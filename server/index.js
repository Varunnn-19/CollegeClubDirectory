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
   CORS
===================== */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (
        origin.startsWith("http://localhost:3000") ||
        origin.includes(".vercel.app")
      ) {
        return callback(null, true)
      }
      return callback(new Error("Not allowed by CORS"))
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.options("*", cors())

/* =====================
   🔥 BODY PARSER (THIS WAS MISSING)
===================== */
app.use(express.json())      // 👈 REQUIRED
app.use(express.urlencoded({ extended: true })) // optional but safe

/* =====================
   ROUTES
===================== */
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

/* =====================
   ERROR HANDLER
===================== */
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err)
  res
    .status(err.status || 500)
    .json({ message: err.message || "Something went wrong." })
})

/* =====================
   SERVER
===================== */
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
