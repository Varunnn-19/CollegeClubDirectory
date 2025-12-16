import nodemailer from "nodemailer"

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
} = process.env

// Create a transporter lazily so builds don't fail when env is missing
let cachedTransporter = null

function getTransporter() {
  if (cachedTransporter) return cachedTransporter
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    console.warn("[Email] SMTP environment variables are missing; emails will not be sent.")
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
    const error = new Error("Email transporter not configured.")
    console.warn("[Email] Transporter not configured; set EMAIL_* environment variables.")
    throw error
  }

  await transporter.sendMail({
    from: EMAIL_FROM || EMAIL_USER,
    to,
    subject,
    text,
    html,
  })
}

export async function sendOtpEmail(to, code) {
  const text = `Your login code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`
  const html = `<p>Your login code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`

  await sendEmail({
    to,
    subject: "Your College Club Directory login code",
    text,
    html,
  })
}


