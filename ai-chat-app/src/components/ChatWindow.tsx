"use client"

import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import { Sparkles } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  streamingText: string
}

export default function ChatWindow({
  messages,
  isLoading,
  streamingText,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Empty State */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
              style={{ background: "linear-gradient(135deg, #e879f9, #a855f7)" }}
            >
              <Sparkles size={36} className="text-white" />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Hello there! 👋
            </h2>
            <p
              className="text-sm max-w-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              I'm your AI assistant powered by LLaMA. Ask me anything — I'm here to help!
            </p>

            {/* Suggestion Pills */}
            <div className="flex flex-wrap gap-2 mt-8 justify-center">
              {[
                "✍️ Help me write something",
                "💡 Give me an idea",
                "🔍 Explain a concept",
                "💻 Help me code",
              ].map((suggestion) => (
                <div
                  key={suggestion}
                  className="px-4 py-2 rounded-2xl text-sm cursor-pointer transition-all hover:opacity-80"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {/* Streaming */}
        {streamingText && (
          <MessageBubble
            key="streaming"
            role="assistant"
            content={streamingText + "▋"}
          />
        )}

        {/* Loading dots */}
        {isLoading && !streamingText && (
          <div className="flex justify-start mb-4">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center text-white text-xs mr-3 mt-1 shrink-0"
              style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)" }}
            >
              ✨
            </div>
            <div
              className="px-5 py-4 rounded-3xl rounded-bl-sm"
              style={{
                background: "var(--ai-bubble)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--accent)",
                      animationDelay: `${delay}ms`,
                    }}
                  />
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