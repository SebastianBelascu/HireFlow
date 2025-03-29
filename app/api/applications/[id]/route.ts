import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with server-side environment variables
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET a specific application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Verify authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get the application
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the application
    if (application.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to view this application' },
        { status: 403 }
      );
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// DELETE an application by ID (withdraw application)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Verify authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if the application exists
    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the application
    if (application.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to withdraw this application' },
        { status: 403 }
      );
    }

    // Delete the application
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Application withdrawn successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    );
  }
}
