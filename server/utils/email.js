import nodemailer from "nodemailer"

// Create a transporter lazily so builds don't fail when env is missing
let cachedTransporter = null

function getTransporter() {
  if (cachedTransporter) return cachedTransporter

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    console.warn("[Email] SMTP environment variables are missing. Simulation mode active.")
    return null
  }

  cachedTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })
  return cachedTransporter
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter()

  if (!transporter) {
    const code = text.match(/\d{6}/)?.[0] || "N/A"
    console.log("-------------------------------------------------------")
    console.log("--- EMAIL SIMULATION (NO SMTP CONFIG FOUND) ---")
    console.log(`TO: ${to}`)
    console.log(`SUBJECT: ${subject}`)
    console.log(`CODE: ${code}`)
    console.log("-------------------------------------------------------")
    return { success: true, simulated: true, code }
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    })
    return { success: true, simulated: false }
  } catch (error) {
    console.error("[Email Error]", error)
    return { success: false, error: error.message }
  }
}

export async function sendOtpEmail(to, code) {
  const text = `Your login code is ${code}. It expires in 10 minutes.`
  const html = `<p>Your login code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`
  return await sendEmail({
    to,
    subject: "Your College Club Directory login code",
    text,
    html,
  })
}
