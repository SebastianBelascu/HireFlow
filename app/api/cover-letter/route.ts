import { getAuthSession } from '@/lib/auth';
import { openai } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: session.user.id,
      },
    });

    if (!profile || !profile.cvUrl) {
      return NextResponse.json(
        { message: 'Profile or CV not found' },
        { status: 404 }
      );
    }

    const { jobTitle, companyName, jobDescription } = await req.json();

    if (!jobTitle || !companyName || !jobDescription) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate cover letter using OpenAI
    const prompt = `
      Generate a professional cover letter for a ${jobTitle} position at ${companyName}.
      
      About the candidate:
      - Name: ${session.user.name || 'The candidate'}
      - Skills: ${profile.skills.join(', ')}
      - Experience: ${profile.experience || 'Not provided'}
      - Education: ${profile.education || 'Not provided'}
      
      Job Description:
      ${jobDescription}
      
      The cover letter should:
      1. Be professionally formatted
      2. Highlight relevant skills and experience
      3. Show enthusiasm for the role and company
      4. Be approximately 300-400 words
      5. Not include the candidate's address or the company's address
      6. Start with "Dear Hiring Manager," and end with "Sincerely, [Candidate Name]"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            "You are a professional cover letter writer. Create compelling, tailored cover letters that highlight a candidate's relevant skills and experience.",
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const coverLetter = response.choices[0].message.content;

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error in cover letter generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
