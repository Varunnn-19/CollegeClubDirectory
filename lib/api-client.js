const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "/api";



async function parseJSON(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`

  let actorHeaders = {}
  if (typeof window !== "undefined") {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
      const userId = currentUser?.id || currentUser?._id
      if (userId) {
        actorHeaders["x-user-id"] = String(userId)
      }
    } catch {
      // ignore
    }
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...actorHeaders,
      ...headers,
    },
  }

  if (body !== undefined) {
    options.body = typeof body === "string" ? body : JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, options)
  } catch (error) {
    console.error(`[api] ${method} ${url} failed`, error)
    throw new Error("Unable to reach the server. Please make sure the backend is running.")
  }

  const data = await parseJSON(response)

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed")
    error.status = response.status
    throw error
  }

  return data
}

