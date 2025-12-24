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
    const body = req.body || {}

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
    } = body

    if (role === "pageAdmin") {
      return res.status(403).json({
        message: "Page admin accounts can only be created by an administrator in the database.",
      })
    }

    const normalizedRole = role === "admin" ? "clubAdmin" : role
    const wantsClubAdmin = normalizedRole === "clubAdmin"

    if (wantsClubAdmin && (!assignedClubId || String(assignedClubId).trim() === "")) {
      return res.status(400).json({ message: "Club admins must select a club to manage." })
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res.status(400).json({
        message: "Email must be from @bmsce.ac.in domain.",
      })
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
        return res.status(404).json({
          message: "Registration session not found.",
        })
      }

      if (user.otpCode !== otp || user.otpExpiresAt < Date.now()) {
        return res.status(400).json({
          message: "Invalid or expired OTP.",
        })
      }

      user.otpCode = undefined
      user.otpExpiresAt = undefined
      await user.save()

      return res.status(201).json({
        user: sanitizeUser(user),
      })
    }

    const existing = await User.findOne({ email })

    if (existing && !existing.otpCode) {
      return res.status(400).json({
        message: "Email already registered.",
      })
    }

    const otpCode = generateOtp()
    const passwordHash = await bcrypt.hash(password, 10)

    if (existing) {
      existing.name = name
      existing.passwordHash = passwordHash
      existing.usn = usn
      existing.yearOfStudy = yearOfStudy
      existing.phoneNumber = phoneNumber
      existing.role = normalizedRole
      existing.assignedClubId = wantsClubAdmin ? assignedClubId : ""
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
        role: normalizedRole,
        assignedClubId: wantsClubAdmin ? assignedClubId : "",
        otpCode,
        otpExpiresAt: new Date(
          Date.now() + OTP_EXPIRY_MINUTES * 60000
        ),
      })
    }

    const emailResult = await sendOtpEmail(email, otpCode)
    const isDev = process.env.NODE_ENV !== "production" || process.env.EMAIL_SIMULATION_MODE === "true"
    const devOtp = emailResult?.simulated && isDev ? emailResult?.code : undefined

    return res.status(200).json({
      otpRequired: true,
      message: devOtp
        ? `OTP sent to your college email. (DEV OTP: ${devOtp})`
        : "OTP sent to your college email.",
    })
  })
)

/* =====================================================
   LOGIN
===================================================== */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = req.body || {}

    const email = body.email
    const password = body.password
    const otp = body.otp

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password.",
      })
    }

    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res.status(400).json({
        message: "Email must be from @bmsce.ac.in domain.",
      })
    }

    const user = await User.findOne({ email }).select(
      "+passwordHash +otpCode +otpExpiresAt"
    )

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials.",
      })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials.",
      })
    }

    /* ---------- OTP VERIFICATION ---------- */
    if (otp) {
      if (user.otpCode !== otp || user.otpExpiresAt < Date.now()) {
        return res.status(400).json({
          message: "Invalid or expired OTP.",
        })
      }

      user.otpCode = undefined
      user.otpExpiresAt = undefined
      await user.save()

      return res.json({
        user: sanitizeUser(user),
      })
    }

    const otpCode = generateOtp()
    user.otpCode = otpCode
    user.otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60000
    )
    await user.save()

    const emailResult = await sendOtpEmail(email, otpCode)
       const isDev = process.env.NODE_ENV !== "production" || process.env.EMAIL_SIMULATION_MODE === "true"138
    
    const devOtp = emailResult?.simulated && isDev ? emailResult?.code : undefined

    return res.json({
      otpRequired: true,
      message: devOtp
        ? `OTP sent to your college email. (DEV OTP: ${devOtp})`
        : "OTP sent to your college email.",
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
      return res.status(404).json({
        message: "User not found.",
      })
    }
    res.json({
      user: sanitizeUser(user),
    })
  })
)

/* =====================================================
   UPDATE USER
===================================================== */
router.patch(
  "/id/:id",
  asyncHandler(async (req, res) => {
    const actorId = req.header("x-user-id")
    if (!actorId) {
      return res.status(401).json({ message: "Missing user context." })
    }

    const actor = await User.findById(actorId)
    if (!actor) {
      return res.status(401).json({ message: "Invalid user context." })
    }

    const assignedClubId = actor.assignedClubId
    const hasAssignedClub =
      assignedClubId !== undefined &&
      assignedClubId !== null &&
      String(assignedClubId).trim() !== "" &&
      String(assignedClubId).trim().toLowerCase() !== "null" &&
      String(assignedClubId).trim().toLowerCase() !== "undefined"

    const isPageAdmin = actor.role === "pageAdmin" || (actor.role === "admin" && !hasAssignedClub)
    const isSelf = String(actor.id) === String(req.params.id)

    if (!isSelf && !isPageAdmin) {
      return res.status(403).json({ message: "Not authorized." })
    }

    const updates = { ...(req.body || {}) }

    if (updates.role === "pageAdmin") {
      delete updates.role
    }

    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10)
      delete updates.password
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      })
    }

    res.json({
      user: sanitizeUser(user),
    })
  })
)

/* =====================================================
   FORGOT PASSWORD REQUEST
===================================================== */
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body || {}

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      })
    }

    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res.status(400).json({
        message: "Email must be from @bmsce.ac.in domain.",
      })
    }

    const user = await User.findOne({ email }).select("+otpCode +otpExpiresAt")

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: "If an account with this email exists, a password reset OTP has been sent.",
      })
    }

    const otpCode = generateOtp()
    user.otpCode = otpCode
    user.otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60000
    )
    await user.save()

    const emailResult = await sendOtpEmail(email, otpCode)
    const isDev = process.env.NODE_ENV !== "production" || process.env.EMAIL_SIMULATION_MODE === "true"
    const devOtp = emailResult?.simulated && isDev ? emailResult?.code : undefined

    return res.json({
      message: devOtp
        ? `Password reset OTP sent to your college email. (DEV OTP: ${devOtp})`
        : "Password reset OTP sent to your college email.",
    })
  })
)

/* =====================================================
   RESET PASSWORD CONFIRMATION
===================================================== */
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body || {}

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Missing required fields.",
      })
    }

    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res.status(400).json({
        message: "Email must be from @bmsce.ac.in domain.",
      })
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{6,}$/

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one special character, and one number.",
      })
    }

    const user = await User.findOne({ email }).select(
      "+otpCode +otpExpiresAt"
    )

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      })
    }

    if (user.otpCode !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP.",
      })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    user.passwordHash = passwordHash
    user.otpCode = undefined
    user.otpExpiresAt = undefined
    await user.save()

    return res.json({
      message: "Password reset successfully. You can now sign in with your new password.",
    })
  })
)

export default router
