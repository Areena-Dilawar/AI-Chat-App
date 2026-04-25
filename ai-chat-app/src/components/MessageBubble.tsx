"use client"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-2xl flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)" }}
        >
          ✨
        </div>
      )}

      {/* Bubble */}
      <div
        className="max-w-[75%] px-4 py-3 rounded-3xl text-sm leading-relaxed shadow-sm"
        style={{
          background: isUser ? "var(--user-bubble)" : "var(--ai-bubble)",
          color: isUser ? "white" : "var(--text-primary)",
          borderBottomRightRadius: isUser ? "4px" : "24px",
          borderBottomLeftRadius: isUser ? "24px" : "4px",
          border: isUser ? "none" : "1px solid var(--border)",
        }}
      >
        {content}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className="w-8 h-8 rounded-2xl flex items-center justify-center text-white text-xs font-bold ml-3 mt-1 shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg, #f0abfc, #c084fc)" }}
        >
          U
        </div>
      )}
    </div>
  )
}