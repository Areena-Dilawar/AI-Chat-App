"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "next-themes"
import { UserButton } from "@clerk/nextjs"
import {
  Plus, MessageSquare, Trash2,
  Sun, Moon, Sparkles, Clock
} from "lucide-react"

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const activeId = params?.conversationId as string
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const load = async () => {
    const res = await fetch("/api/conversations")
    const data = await res.json()
    if (Array.isArray(data)) setConversations(data)
  }

  useEffect(() => { load() }, [])

  const handleNew = async () => {
    setIsCreating(true)
    const res = await fetch("/api/conversations", { method: "POST" })
    const data = await res.json()
    setIsCreating(false)
    router.push(`/chat/${data.id}`)
    load()
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingId(id)
    await fetch(`/api/conversations/${id}`, { method: "DELETE" })
    setDeletingId(null)
    if (activeId === id) router.push("/chat")
    load()
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (hrs < 24) return `${hrs}h ago`
    return `${days}d ago`
  }

  return (
    <aside style={{
      width: "280px",
      minWidth: "280px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--q-sidebar)",
      borderRight: "1px solid var(--q-border)",
      fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "22px 18px 18px",
        borderBottom: "1px solid var(--q-border)",
      }}>
        {/* Brand */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}>
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #6c3ce1 0%, #e85d9a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            animation: "pulse-glow 3s infinite",
            boxShadow: "0 4px 16px rgba(108,60,225,0.35)",
          }}>
            <Sparkles size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "18px",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--q-accent) 0%, var(--q-accent2) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.3px",
            }}>
              AuraChat
            </div>
            <div style={{
              fontSize: "10px",
              color: "var(--q-muted)",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              AI Assistant
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNew}
          disabled={isCreating}
          style={{
            width: "100%",
            padding: "11px 16px",
            borderRadius: "14px",
            border: "1px solid rgba(108,60,225,0.3)",
            background: isCreating
              ? "rgba(108,60,225,0.1)"
              : "linear-gradient(135deg, #6c3ce1, #8b5cf6)",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: isCreating ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            letterSpacing: "0.2px",
            transition: "all 0.25s ease",
            boxShadow: isCreating ? "none" : "0 4px 16px rgba(108,60,225,0.3)",
          }}
          onMouseEnter={e => {
            if (!isCreating) {
              e.currentTarget.style.transform = "translateY(-1px)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(108,60,225,0.4)"
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(108,60,225,0.3)"
          }}
        >
          {isCreating ? (
            <div style={{
              width: "14px", height: "14px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          ) : (
            <Plus size={15} strokeWidth={2.5} />
          )}
          {isCreating ? "Creating..." : "New conversation"}
        </button>
      </div>

      {/* Conversations */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "14px 10px",
      }}>
        {conversations.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px",
            gap: "10px",
          }}>
            <MessageSquare size={28} color="var(--q-muted)" strokeWidth={1.5} />
            <p style={{ fontSize: "13px", color: "var(--q-muted)", textAlign: "center" }}>
              No conversations yet.<br />Start a new chat!
            </p>
          </div>
        ) : (
          <>
            <p style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "var(--q-muted)",
              padding: "2px 10px 10px",
            }}>
              Recent
            </p>
            {conversations.map((conv, i) => {
              const isActive = activeId === conv.id
              const isDeleting = deletingId === conv.id
              return (
                <div
                  key={conv.id}
                  onClick={() => !isDeleting && router.push(`/chat/${conv.id}`)}
                  className="slide-enter"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 10px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    marginBottom: "2px",
                    transition: "all 0.2s ease",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(108,60,225,0.12), rgba(232,93,154,0.06))"
                      : "transparent",
                    border: `1px solid ${isActive ? "rgba(108,60,225,0.25)" : "transparent"}`,
                    opacity: isDeleting ? 0.5 : 1,
                    animationDelay: `${i * 0.03}s`,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(108,60,225,0.06)"
                      e.currentTarget.style.borderColor = "var(--q-border)"
                    }
                    const btn = e.currentTarget.querySelector(".del-btn") as HTMLElement
                    if (btn) btn.style.opacity = "1"
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent"
                      e.currentTarget.style.borderColor = "transparent"
                    }
                    const btn = e.currentTarget.querySelector(".del-btn") as HTMLElement
                    if (btn) btn.style.opacity = "0"
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: "30px", height: "30px",
                    borderRadius: "10px",
                    background: isActive
                      ? "linear-gradient(135deg, #6c3ce1, #8b5cf6)"
                      : "var(--q-border)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}>
                    <MessageSquare
                      size={13}
                      color={isActive ? "white" : "var(--q-muted)"}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--q-text)" : "var(--q-text2)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: "2px",
                    }}>
                      {conv.title}
                    </div>
                    <div style={{
                      fontSize: "10px",
                      color: "var(--q-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}>
                      <Clock size={9} />
                      {formatTime(conv.updatedAt)}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    className="del-btn"
                    onClick={(e) => handleDelete(conv.id, e)}
                    style={{
                      opacity: 0,
                      background: "rgba(239,68,68,0.1)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.2)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.1)"
                    }}
                  >
                    <Trash2 size={12} color="#ef4444" />
                  </button>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid var(--q-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <UserButton />
          <span style={{
            fontSize: "13px",
            color: "var(--q-text2)",
            fontWeight: 500,
          }}>
            My Account
          </span>
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
            style={{
              width: "32px", height: "32px",
              borderRadius: "10px",
              border: "1px solid var(--q-border)",
              background: "var(--q-surface)",
              cursor: "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--q-accent)"
              e.currentTarget.style.transform = "rotate(20deg)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--q-border)"
              e.currentTarget.style.transform = "rotate(0)"
            }}
          >
            {theme === "dark"
              ? <Sun size={14} color="var(--q-gold)" />
              : <Moon size={14} color="var(--q-accent)" />
            }
          </button>
        )}
      </div>
    </aside>
  )
}