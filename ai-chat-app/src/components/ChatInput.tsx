"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div
      className="p-4 border-t"
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="flex items-end gap-3 max-w-3xl mx-auto rounded-3xl px-4 py-3 shadow-sm"
        style={{
          background: "var(--input-bg)",
          border: "1.5px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message... ✨"
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none text-sm focus:outline-none max-h-40 overflow-y-auto bg-transparent"
          style={{ color: "var(--text-primary)" }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-2xl flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{ background: "var(--accent)" }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={15} />
          )}
        </button>
      </div>

      <p
        className="text-xs text-center mt-2"
        style={{ color: "var(--text-muted)" }}
      >
        AI can make mistakes · Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}