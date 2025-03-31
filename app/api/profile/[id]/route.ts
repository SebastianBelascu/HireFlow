import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = session.user.role === "ADMIN"
    const isOwnProfile = params.id === session.user.id

    // Only allow admins or the user themselves to view profiles
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: params.id,
      },
    })

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Error fetching profile" }, { status: 500 })
  }
}

