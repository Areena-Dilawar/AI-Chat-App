"use client"

import { Sparkles } from "lucide-react"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div
      className="msg-enter"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: "10px",
        marginBottom: "20px",
        fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
      }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div style={{
          width: "34px", height: "34px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6c3ce1, #8b5cf6)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(108,60,225,0.35)",
        }}>
          <Sparkles size={15} color="white" strokeWidth={2} />
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: "70%",
        padding: isUser ? "12px 18px" : "14px 18px",
        borderRadius: isUser
          ? "20px 20px 6px 20px"
          : "6px 20px 20px 20px",
        fontSize: "14px",
        lineHeight: 1.75,
        fontWeight: 400,
        letterSpacing: "0.1px",
        background: isUser
          ? "linear-gradient(135deg, #6c3ce1 0%, #9333ea 50%, #e85d9a 100%)"
          : "var(--q-ai-bubble)",
        color: isUser ? "#ffffff" : "var(--q-text)",
        border: isUser
          ? "none"
          : "1px solid var(--q-border)",
        boxShadow: isUser
          ? "0 6px 20px rgba(108,60,225,0.3)"
          : "var(--q-shadow)",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
        position: "relative",
        backdropFilter: isUser ? "none" : "blur(8px)",
      }}>
        {content}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div style={{
          width: "34px", height: "34px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #e85d9a, #f472b6)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "14px",
          fontWeight: 700,
          color: "white",
          boxShadow: "0 4px 12px rgba(232,93,154,0.35)",
        }}>
          U
        </div>
      )}
    </div>
  )
}