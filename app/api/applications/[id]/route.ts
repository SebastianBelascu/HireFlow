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

    const application = await prisma.jobApplication.findUnique({
      where: {
        id: params.id,
      },
      include: {
        job: true,
        user: true,
      },
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Check if user is authorized to view this application
    if (!isAdmin && application.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ message: "Error fetching application" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    // Update application status
    const application = await prisma.jobApplication.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    })

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ message: "Error updating application" }, { status: 500 })
  }
}

