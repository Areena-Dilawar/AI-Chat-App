"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, Trash2, MessageSquare, Sparkles, Sun, Moon } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const activeId = params?.conversationId as string
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const loadConversations = async () => {
    const res = await fetch("/api/conversations")
    const data = await res.json()
    if (Array.isArray(data)) setConversations(data)
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const handleNewChat = async () => {
    setIsLoading(true)
    const res = await fetch("/api/conversations", { method: "POST" })
    const data = await res.json()
    setIsLoading(false)
    router.push(`/chat/${data.id}`)
    loadConversations()
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await fetch(`/api/conversations/${id}`, { method: "DELETE" })
    if (activeId === id) router.push("/chat")
    loadConversations()
  }

  return (
    <div
      className="w-72 flex flex-col h-full shrink-0 border-r"
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <span
            className="font-bold text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            AI Chat
          </span>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={16} />
          {isLoading ? "Creating..." : "New Chat"}
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-2 py-2"
          style={{ color: "var(--text-muted)" }}
        >
          Recent Chats
        </p>

        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare
              size={32}
              className="mx-auto mb-2 opacity-30"
              style={{ color: "var(--text-muted)" }}
            />
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              No chats yet
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-2xl cursor-pointer transition-all"
              style={{
                background: activeId === conv.id
                  ? "var(--bg-secondary)"
                  : "transparent",
                border: activeId === conv.id
                  ? `1px solid var(--border)`
                  : "1px solid transparent",
              }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: activeId === conv.id
                    ? "var(--accent)"
                    : "var(--border)",
                }}
              >
                <MessageSquare
                  size={12}
                  className={activeId === conv.id ? "text-white" : ""}
                  style={{
                    color: activeId === conv.id
                      ? "white"
                      : "var(--text-muted)"
                  }}
                />
              </div>
              <span
                className="text-sm truncate flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                {conv.title}
              </span>
              <button
                onClick={(e) => handleDelete(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className="p-4 border-t flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <UserButton />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Account
          </span>
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: "var(--border)" }}
          >
            {theme === "dark"
              ? <Sun size={14} style={{ color: "var(--text-primary)" }} />
              : <Moon size={14} style={{ color: "var(--text-primary)" }} />
            }
          </button>
        )}
      </div>
    </div>
  )
}