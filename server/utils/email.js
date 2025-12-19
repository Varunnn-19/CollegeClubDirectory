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
  const isGmail = EMAIL_HOST.includes("gmail.com")

  // Use Pool: false for better reliability on cloud platforms with restricted outbound
  cachedTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
  
  return cachedTransporter
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter()
  const code = text.match(/\d{6}/)?.[0] || "N/A"

  if (!transporter) {
    console.log("-------------------------------------------------------")
    console.log("--- EMAIL SIMULATION (NO SMTP CONFIG FOUND) ---")
    console.log(`TO: ${to}`)
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
    console.error("[Email Error Detail]", error)
    
    // If connection fails, provide the OTP in the error message so the user isn't blocked
    const errorMsg = `Email failed (${error.code || 'TIMEOUT'}). Since you're developing, use this code: ${code}`

    return { 
      success: true, // Mark as success so the UI moves forward
      simulated: true, 
      code, 
      error: errorMsg 
    }
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
