"use client"

import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import {
  Sparkles, PenLine, Lightbulb,
  Code2, BookOpen, Zap, Globe
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  streamingText: string
  onSuggestion?: (text: string) => void
}

const suggestions = [
  {
    icon: PenLine,
    title: "Draft an email",
    subtitle: "Professional writing",
    prompt: "Write a professional follow-up email to a client after a project meeting",
    color: "#6c3ce1",
  },
  {
    icon: Code2,
    title: "Review my code",
    subtitle: "Debug & optimize",
    prompt: "Review this React component and suggest performance improvements and best practices",
    color: "#0ea5e9",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    subtitle: "Creative thinking",
    prompt: "Give me 5 innovative product ideas for a mobile app targeting remote workers in 2025",
    color: "#f59e0b",
  },
  {
    icon: BookOpen,
    title: "Explain a concept",
    subtitle: "Learn anything",
    prompt: "Explain machine learning in simple terms with a real-world analogy",
    color: "#10b981",
  },
  {
    icon: Zap,
    title: "Boost productivity",
    subtitle: "Work smarter",
    prompt: "Create a daily productivity system for a software developer working from home",
    color: "#e85d9a",
  },
  {
    icon: Globe,
    title: "Research a topic",
    subtitle: "Deep insights",
    prompt: "What are the most important trends shaping the future of AI in the next 5 years?",
    color: "#8b5cf6",
  },
]

export default function ChatWindow({
  messages,
  isLoading,
  streamingText,
  onSuggestion,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      background: "var(--q-bg)",
      position: "relative",
      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", top: 0, left: "280px", right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 0, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-150px", right: "-100px",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(108,60,225,0.06) 0%, transparent 65%)",
          animation: "float 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "50px", left: "10%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(232,93,154,0.04) 0%, transparent 65%)",
          animation: "float 8s ease-in-out infinite reverse",
        }} />
      </div>

      <div style={{
        maxWidth: "820px",
        margin: "0 auto",
        padding: "32px 28px",
        position: "relative",
        zIndex: 1,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ── Empty State ── */}
        {messages.length === 0 && !isLoading && (
          <div className="fade-enter" style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "48px",
          }}>

            {/* Hero icon */}
            <div style={{
              width: "80px", height: "80px",
              borderRadius: "28px",
              background: "linear-gradient(135deg, #6c3ce1 0%, #8b5cf6 50%, #e85d9a 100%)",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              boxShadow: "0 12px 40px rgba(108,60,225,0.4), 0 0 80px rgba(108,60,225,0.1)",
              animation: "float 5s ease-in-out infinite",
            }}>
              <Sparkles size={36} color="white" strokeWidth={1.5} />
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, var(--q-text) 0%, var(--q-accent) 50%, var(--q-accent2) 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "12px",
              animation: "gradient-shift 4s ease infinite",
            }}>
              Good to see you.
            </h1>

            <p style={{
              fontSize: "15px",
              color: "var(--q-text2)",
              maxWidth: "420px",
              textAlign: "center",
              lineHeight: 1.7,
              marginBottom: "48px",
              fontWeight: 300,
            }}>
              I'm AuraChat — your intelligent AI companion. Ask me anything or pick a suggestion below to get started instantly.
            </p>

            {/* Suggestions grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              width: "100%",
              maxWidth: "660px",
            }}>
              {suggestions.map((s, i) => {
                const Icon = s.icon
                return (
                  <button
                    key={i}
                    onClick={() => onSuggestion?.(s.prompt)}
                    className="msg-enter"
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: "1px solid var(--q-border)",
                      background: "var(--q-surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                      animationDelay: `${i * 0.06}s`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.01)"
                      e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}22`
                      e.currentTarget.style.borderColor = s.color + "55"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)"
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = "var(--q-border)"
                    }}
                  >
                    <div style={{
                      width: "34px", height: "34px",
                      borderRadius: "10px",
                      background: s.color + "18",
                      border: `1px solid ${s.color}30`,
                      display: "flex", alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Icon size={16} color={s.color} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--q-text)",
                        marginBottom: "3px",
                      }}>
                        {s.title}
                      </div>
                      <div style={{
                        fontSize: "11px",
                        color: "var(--q-muted)",
                        fontWeight: 400,
                      }}>
                        {s.subtitle}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {/* ── Streaming ── */}
        {streamingText && (
          <MessageBubble key="streaming" role="assistant" content={streamingText + "▋"} />
        )}

        {/* ── Loading dots ── */}
        {isLoading && !streamingText && (
          <div className="msg-enter" style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
            marginBottom: "20px",
          }}>
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
            <div style={{
              padding: "14px 18px",
              borderRadius: "6px 20px 20px 20px",
              background: "var(--q-ai-bubble)",
              border: "1px solid var(--q-border)",
              boxShadow: "var(--q-shadow)",
            }}>
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {[0, 0.18, 0.36].map((delay, idx) => (
                  <div key={idx} style={{
                    width: "7px", height: "7px",
                    borderRadius: "50%",
                    background: "var(--q-accent)",
                    animation: `bounce-dot 1.3s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}