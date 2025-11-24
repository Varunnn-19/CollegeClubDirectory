const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"

async function parseJSON(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  const data = await parseJSON(response)

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed")
    error.status = response.status
    throw error
  }

  return data
}

