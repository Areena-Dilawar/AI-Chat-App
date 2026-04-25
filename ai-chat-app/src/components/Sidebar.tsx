"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, Trash2, MessageSquare } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const activeId = params?.conversationId as string

  // Load conversations
  const loadConversations = async () => {
    const res = await fetch("/api/conversations")
    const data = await res.json()
    if (Array.isArray(data)) setConversations(data)
  }

  useEffect(() => {
    loadConversations()
  }, [])

  // Create new conversation
  const handleNewChat = async () => {
    setIsLoading(true)
    const res = await fetch("/api/conversations", { method: "POST" })
    const data = await res.json()
    setIsLoading(false)
    router.push(`/chat/${data.id}`)
    loadConversations()
  }

  // Delete conversation
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await fetch(`/api/conversations/${id}`, { method: "DELETE" })
    if (activeId === id) router.push("/chat")
    loadConversations()
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={handleNewChat}
          disabled={isLoading}
          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-xs text-center mt-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className={`group flex items-center gap-2 px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors ${
                activeId === conv.id
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
            >
              <MessageSquare size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-200 truncate flex-1">
                {conv.title}
              </span>
              <button
                onClick={(e) => handleDelete(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer — User Button */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-3">
        <UserButton />
        <span className="text-sm text-gray-400">Account</span>
      </div>
    </div>
  )
}