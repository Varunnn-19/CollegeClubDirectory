import { NextResponse } from "next/server"

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'

const removedResponse = NextResponse.json(
  { message: "Messaging has been removed from this application." },
  { status: 410 }
)

// GET /api/messages/conversations/:userId
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const threadUser1 = url.searchParams.get('user1')
    const threadUser2 = url.searchParams.get('user2')
    
    // Get conversations
    if (userId) {
      const response = await fetch(`${SERVER_URL}/api/messages/conversations/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch conversations' },
          { status: response.status }
        )
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    // Get thread between two users
    if (threadUser1 && threadUser2) {
      const response = await fetch(
        `${SERVER_URL}/api/messages/thread?user1=${threadUser1}&user2=${threadUser2}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch messages' },
          { status: response.status }
        )
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create new message
export async function POST(request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${SERVER_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/messages/read - Mark messages as read
export async function PATCH(request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${SERVER_URL}/api/messages/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to mark messages as read' },
        { status: response.status }
      )
    }
    
    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
  }

