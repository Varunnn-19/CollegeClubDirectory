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
    console.warn("[Email] SMTP environment variables are missing (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS). Simulation mode active.")
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
    console.log("-------------------------------------------------------")
    console.log("--- EMAIL SIMULATION (NO SMTP CONFIG FOUND) ---")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${text}`)
    console.log("-------------------------------------------------------")
    return // No longer throwing in production to allow testing
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  })
}

export async function sendOtpEmail(to, code) {
  const text = `Your login code is ${code}. It expires in 10 minutes.`
  const html = `<p>Your login code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`
  await sendEmail({
    to,
    subject: "Your College Club Directory login code",
    text,
    html,
  })
}
