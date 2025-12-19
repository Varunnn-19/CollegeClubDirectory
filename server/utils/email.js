import nodemailer from "nodemailer"

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

  const port = Number(EMAIL_PORT)
  
  // Use specialized Gmail settings if host is smtp.gmail.com
  const isGmail = EMAIL_HOST.includes("gmail.com")

  cachedTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: port,
    // Port 465 uses secure: true, Port 587 uses secure: false (TLS)
    secure: port === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    // Increase timeouts for cloud environments like Render
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
    // Add pool configuration for better reliability
    pool: isGmail,
    maxConnections: 5,
    maxMessages: 100,
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
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    })
    console.log(`[Email] Sent to ${to}: ${info.messageId}`)
    return { success: true, simulated: false }
  } catch (error) {
    console.error("[Email Error Detail]", {
      message: error.message,
      code: error.code,
      command: error.command
    })
    
    // If it's a timeout, provide a more helpful message
    const errorMsg = error.code === 'ETIMEDOUT' 
      ? "Connection timeout. Please try switching EMAIL_PORT to 587 in Render."
      : error.message

    return { success: false, error: errorMsg }
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
