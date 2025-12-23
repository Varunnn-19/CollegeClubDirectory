import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import asyncHandler from "../utils/asyncHandler.js"
import sanitizeUser from "../utils/sanitizeUser.js"
import { sendOtpEmail } from "../utils/email.js"

const router = express.Router()

const APPROVED_DOMAIN = "@bmsce.ac.in"
const OTP_EXPIRY_MINUTES = 10

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

/* =====================================================
   REGISTER
===================================================== */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing." })
    }

    const {
      name,
      email,
      password,
      usn,
      yearOfStudy,
      phoneNumber,
      role = "user",
      assignedClubId = "",
      otp,
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res
        .status(400)
        .json({ message: "Email must be from @bmsce.ac.in domain." })
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{6,}$/

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one special character, and one number.",
      })
    }

    /* ---------- OTP VERIFICATION ---------- */
    if (otp) {
      const user = await User.findOne({ email }).select(
        "+otpCode +otpExpiresAt"
      )

      if (!user) {
        return res
          .status(404)
          .json({ message: "Registration session not found." })
      }

      if (user.otpCode !== otp || user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP." })
      }

      user.otpCode = undefined
      user.otpExpiresAt = undefined
      await user.save()

      return res.status(201).json({ user: sanitizeUser(user) })
    }

    const existing = await User.findOne({ email })

    if (existing && !existing.otpCode) {
      return res.status(400).json({ message: "Email already registered." })
    }

    const otpCode = generateOtp()
    const passwordHash = await bcrypt.hash(password, 10)

    if (existing) {
      existing.name = name
      existing.passwordHash = passwordHash
      existing.usn = usn
      existing.yearOfStudy = yearOfStudy
      existing.phoneNumber = phoneNumber
      existing.role = role
      existing.assignedClubId = assignedClubId
      existing.otpCode = otpCode
      existing.otpExpiresAt = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60000
      )
      await existing.save()
    } else {
      await User.create({
        name,
        email,
        passwordHash,
        usn,
        yearOfStudy,
        phoneNumber,
        role,
        assignedClubId,
        otpCode,
        otpExpiresAt: new Date(
          Date.now() + OTP_EXPIRY_MINUTES * 60000
        ),
      })
    }

    const otpResult = await sendOtpEmail(email, otpCode)

    if (otpResult.simulated) {
      return res.status(200).json({
        otpRequired: true,
        message: `OTP sent (Simulation Mode). Use code: ${otpCode}`,
        isSimulated: true,
      })
    }

    if (!otpResult.success) {
      return res
        .status(500)
        .json({ message: `Email error: ${otpResult.error}` })
    }

    res.status(200).json({
      otpRequired: true,
      message: "OTP sent to your college email.",
    })
  })
)

/* =====================================================
   LOGIN
===================================================== */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing." })
    }

    const { email, password, otp } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing email or password." })
    }

    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res
        .status(400)
        .json({ message: "Email must be from @bmsce.ac.in domain." })
    }

    const user = await User.findOne({ email }).select(
      "+passwordHash +otpCode +otpExpiresAt"
    )

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    /* ---------- OTP VERIFICATION ---------- */
    if (otp) {
      if (user.otpCode !== otp || user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP." })
      }

      user.otpCode = undefined
      user.otpExpiresAt = undefined
      await user.save()

      return res.json({ user: sanitizeUser(user) })
    }

    const otpCode = generateOtp()
    user.otpCode = otpCode
    user.otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60000
    )
    await user.save()

    const otpResult = await sendOtpEmail(email, otpCode)

    if (otpResult.simulated) {
      return res.status(200).json({
        otpRequired: true,
        message: `OTP sent (Simulation Mode). Use code: ${otpCode}`,
        isSimulated: true,
      })
    }

    if (!otpResult.success) {
      return res
        .status(500)
        .json({ message: `Email error: ${otpResult.error}` })
    }

    res.json({
      otpRequired: true,
      message: "OTP sent to your college email.",
    })
  })
)

/* =====================================================
   GET USER BY ID
===================================================== */
router.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    res.json({ user: sanitizeUser(user) })
  })
)

/* =====================================================
   UPDATE USER
===================================================== */
router.patch(
  "/id/:id",
  asyncHandler(async (req, res) => {
    const updates = { ...req.body }

    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10)
      delete updates.password
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    res.json({ user: sanitizeUser(user) })
  })
)

export default router
