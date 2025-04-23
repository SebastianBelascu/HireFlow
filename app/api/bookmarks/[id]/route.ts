import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const jobId = await params.id

    // Check if bookmark exists
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        user_id_job_id: {
          user_id: session.user.id,
          job_id: jobId,
        },
      },
    })

    if (!bookmark) {
      return NextResponse.json({ message: "Bookmark not found" }, { status: 404 })
    }

    // Delete bookmark
    await prisma.bookmark.delete({
      where: {
        user_id_job_id: {
          user_id: session.user.id,
          job_id: jobId,
        },
      },
    })

    return NextResponse.json({ message: "Bookmark removed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ message: "Error removing bookmark" }, { status: 500 })
  }
}
