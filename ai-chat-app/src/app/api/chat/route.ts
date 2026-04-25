import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { prisma } from "@/lib/prisma"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const authObject = await auth()
    const userId = authObject.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages, conversationId } = await request.json()

    if (!messages || !conversationId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const userMessage = messages[messages.length - 1]

    await prisma.message.create({
      data: {
        role: "user",
        content: userMessage.content,
        conversationId,
      },
    })

    if (messages.length === 1) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { title: userMessage.content.slice(0, 50) },
      })
    }

    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a helpful AI assistant. Be concise and clear.",
      messages,
    })

    let fullText = ""
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.textStream) {
          fullText += chunk
          controller.enqueue(encoder.encode(chunk))
        }

        await prisma.message.create({
          data: {
            role: "assistant",
            content: fullText,
            conversationId,
          },
        })

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        })

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })

  } catch (error) {
    console.error("POST /api/chat error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}