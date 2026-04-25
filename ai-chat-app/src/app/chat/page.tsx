import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export default async function ChatPage() {
  const { userId } = await auth()

  if (!userId) redirect("/sign-in")

  // Get latest conversation or create new one
  const latest = await prisma.conversation.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })

  if (latest) {
    redirect(`/chat/${latest.id}`)
  } else {
    // Create first conversation
    const newConv = await prisma.conversation.create({
      data: { userId, title: "New Chat" },
    })
    redirect(`/chat/${newConv.id}`)
  }
}