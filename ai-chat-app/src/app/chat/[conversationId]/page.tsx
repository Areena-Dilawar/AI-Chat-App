"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import ChatWindow from "@/components/ChatWindow"
import ChatInput from "@/components/ChatInput"
import { Sparkles } from "lucide-react"

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
  const [convTitle, setConvTitle] = useState("New conversation")

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    }
    load()
  }, [conversationId])

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setStreamingText("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error("Failed")

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value)
          setStreamingText(full)
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: full,
      }])
      setStreamingText("")

      if (messages.length === 0) {
        setConvTitle(content.slice(0, 40))
      }

    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--q-bg)",
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
      }}>
        {/* Top bar */}
        <div style={{
          padding: "14px 28px",
          borderBottom: "1px solid var(--q-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--q-surface)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "8px", height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px rgba(16,185,129,0.6)",
              animation: "pulse-glow 2s infinite",
            }} />
            <span style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--q-text2)",
            }}>
              {convTitle}
            </span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "20px",
            border: "1px solid var(--q-border)",
            background: "var(--q-bg)",
          }}>
            <Sparkles size={12} color="var(--q-accent)" />
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--q-accent)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              LLaMA 3.3
            </span>
          </div>
        </div>

        {/* Chat area */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          streamingText={streamingText}
          onSuggestion={handleSend}
        />

        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}