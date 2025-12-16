
import { NextResponse } from "next/server"

const removedResponse = NextResponse.json(
  { message: "Messaging has been removed from this application." },
  { status: 410 }
)

// Catch-all handler for /api/messages/[...path]
export async function GET(request, { params }) {
  try {
    const path = params.path?.join('/') || ''
    const url = new URL(request.url)
    const queryString = url.search
    
    const serverUrl = `${SERVER_URL}/api/messages/${path}${queryString}`
    
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        errorData || { error: 'Request failed' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path?.join('/') || ''
    const body = await request.json()
    
    const serverUrl = `${SERVER_URL}/api/messages/${path}`
    
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        errorData || { error: 'Request failed' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const path = params.path?.join('/') || ''
    const body = await request.json()
    
    const serverUrl = `${SERVER_URL}/api/messages/${path}`
    
    const response = await fetch(serverUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        errorData || { error: 'Request failed' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const path = params.path?.join('/') || ''
    
    const serverUrl = `${SERVER_URL}/api/messages/${path}`
    
    const response = await fetch(serverUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        errorData || { error: 'Request failed' },
        { status: response.status }
      )
    }
    
    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }

}
