"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { ArrowUp, Paperclip } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }

  const canSend = input.trim().length > 0 && !isLoading

  return (
    <div style={{
      padding: "16px 28px 20px",
      background: "var(--q-bg)",
      borderTop: "1px solid var(--q-border)",
      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
    }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        {/* Input container */}
        <div style={{
          background: "var(--q-surface)",
          border: `1.5px solid ${focused ? "var(--q-accent)" : "var(--q-border)"}`,
          borderRadius: "20px",
          padding: "12px 14px 12px 18px",
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          transition: "all 0.3s ease",
          boxShadow: focused
            ? "0 0 0 4px rgba(108,60,225,0.08), var(--q-glow)"
            : "var(--q-shadow)",
        }}>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            placeholder="Message AuraChat..."
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "var(--q-text)",
              maxHeight: "160px",
              overflowY: "auto",
              fontFamily: "inherit",
              paddingTop: "2px",
            }}
          />

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              style={{
                width: "36px", height: "36px",
                borderRadius: "12px",
                border: "none",
                background: canSend
                  ? "linear-gradient(135deg, #6c3ce1, #8b5cf6)"
                  : "var(--q-border)",
                color: canSend ? "white" : "var(--q-muted)",
                cursor: canSend ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                boxShadow: canSend ? "0 4px 14px rgba(108,60,225,0.35)" : "none",
                transform: canSend ? "scale(1)" : "scale(0.92)",
              }}
              onMouseEnter={e => {
                if (canSend) {
                  e.currentTarget.style.transform = "scale(1.08) translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,60,225,0.45)"
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = canSend ? "scale(1)" : "scale(0.92)"
                e.currentTarget.style.boxShadow = canSend ? "0 4px 14px rgba(108,60,225,0.35)" : "none"
              }}
            >
              {isLoading ? (
                <div style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.25)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
              ) : (
                <ArrowUp size={16} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginTop: "10px",
        }}>
          <span style={{ fontSize: "11px", color: "var(--q-muted)", letterSpacing: "0.2px" }}>
            Press <kbd style={{
              background: "var(--q-border)",
              padding: "1px 6px",
              borderRadius: "5px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "var(--q-text2)",
            }}>Enter</kbd> to send
          </span>
          <span style={{ fontSize: "11px", color: "var(--q-muted)" }}>·</span>
          <span style={{ fontSize: "11px", color: "var(--q-muted)" }}>
            <kbd style={{
              background: "var(--q-border)",
              padding: "1px 6px",
              borderRadius: "5px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "var(--q-text2)",
            }}>Shift+Enter</kbd> for new line
          </span>
          <span style={{ fontSize: "11px", color: "var(--q-muted)" }}>·</span>
          <span style={{ fontSize: "11px", color: "var(--q-muted)" }}>
            AI may make mistakes
          </span>
        </div>
      </div>
    </div>
  )
}