"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"
import {
  getConversations,
  getMessagesBetweenUsers,
  saveMessage,
  markMessagesAsRead,
} from "@/lib/data-utils"
import Link from "next/link"

export default function MessagesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null")
      if (!user) {
        router.push("/sign-in")
        return
      }

      setCurrentUser(user)
      loadConversations()
      setLoading(false)
    }
  }, [router])

  const loadConversations = () => {
    if (!currentUser) return
    const convs = getConversations(currentUser.id)
    setConversations(convs)
  }

  const loadMessages = (otherUserId) => {
    if (!currentUser) return
    const msgs = getMessagesBetweenUsers(currentUser.id, otherUserId)
    setMessages(msgs)
    markMessagesAsRead(otherUserId, currentUser.id)
    loadConversations() // Refresh to update unread counts
  }

  const handleSelectUser = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName })
    loadMessages(userId)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !selectedUser) return

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const receiver = users.find((u) => u.id === selectedUser.id)

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      senderName: currentUser.name,
      receiverName: receiver?.name || selectedUser.name,
      content: newMessage.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }

    saveMessage(message)
    setNewMessage("")
    loadMessages(selectedUser.id)
    loadConversations()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="border rounded-lg bg-card dark:bg-card overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-medium">Conversations</h2>
            </div>
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No conversations yet. Start messaging other users!
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => handleSelectUser(conv.userId, conv.userName)}
                    className={`w-full text-left p-4 hover:bg-muted dark:hover:bg-muted transition-colors ${
                      selectedUser?.id === conv.userId ? "bg-primary/10 dark:bg-primary/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{conv.userName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 border rounded-lg bg-card dark:bg-card flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-medium">{selectedUser.name}</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isSender = msg.senderId === currentUser.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSender
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isSender ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

