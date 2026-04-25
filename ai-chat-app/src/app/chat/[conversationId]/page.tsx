"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import ChatWindow from "@/components/ChatWindow"
import ChatInput from "@/components/ChatInput"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.conversationId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    }
    loadMessages()
  }, [conversationId])

  const handleSend = async (content: string) => {
    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setStreamingText("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          fullText += chunk
          setStreamingText(fullText)
        }
      }

      // Add complete AI message to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullText,
      }
      setMessages((prev) => [...prev, aiMessage])
      setStreamingText("")

    } catch (error) {
      console.error("Send error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          streamingText={streamingText}
        />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}