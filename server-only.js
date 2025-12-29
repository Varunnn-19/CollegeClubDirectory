import express from "express"
import cors from "cors"

import createSimulationRouter, { isSimulationMode } from "./server/simulation.js"

const app = express()
const PORT = process.env.PORT || 4000

/* =====================
   BODY PARSERS (MUST BE FIRST)
===================== */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* =====================
   CORS (FINAL FIX)
===================== */
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-approver-email",
    "x-user-id",
  ],
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

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
const SIMULATION = isSimulationMode()

if (SIMULATION) {
  console.log("🚀 Running in SIMULATION mode")
  app.use("/api", createSimulationRouter())
} else {
  console.log("🗄️ Running with MongoDB")
}

/* =====================
   START SERVER
===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Simulation mode: ${SIMULATION ? "ON" : "OFF"}`)
})
