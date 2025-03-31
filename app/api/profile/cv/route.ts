import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { uploadCV, getCVContent } from '@/lib/supabase-storage';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const cvFile = formData.get('cv') as File;

    if (!cvFile) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Upload the file to a storage service (e.g., AWS S3, Vercel Blob)
    // 2. Parse the CV content using a document parsing service
    // For this example, we'll simulate this process

    // Simulate file upload and get a URL
    const { url: cvUrl, path: cvPath } = await uploadCV(
      session.user.id,
      cvFile
    );
    const cvContent = await getCVContent(cvPath);

    // Use OpenAI to analyze the CV content
    console.log('Starting OpenAI analysis...');
    const prompt = `
      Extract the following information from this CV:
      1. Skills (as a list of keywords)
      2. Experience summary (1-2 sentences)
      3. Education summary (1-2 sentences)
      4. Work history (as structured data)

      CV Content:
      ${cvContent.substring(0, 4000)}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a CV analysis assistant. Extract structured information from CVs accurately.
            Format your response exactly like this:
            Skills:
            - skill1
            - skill2
            
            Experience:
            Brief summary here
            
            Education:
            Brief summary here
            
            Work history:
            Company: Position (Duration)
            - Responsibilities`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const analysis = response.choices[0].message.content;
    console.log('Raw OpenAI Analysis:', analysis);

    // Parse the analysis with more robust matching
    const skillsMatch = analysis?.match(/Skills:[\s\S]*?(?=Experience:|$)/i);
    const experienceMatch = analysis?.match(
      /Experience:[\s\S]*?(?=Education:|$)/i
    );
    const educationMatch = analysis?.match(
      /Education:[\s\S]*?(?=Work history:|$)/i
    );
    const workHistoryMatch = analysis?.match(/Work history:[\s\S]*?(?=$)/i);

    console.log('Matches found:', {
      hasSkills: !!skillsMatch,
      hasExperience: !!experienceMatch,
      hasEducation: !!educationMatch,
      hasWorkHistory: !!workHistoryMatch,
    });

    // Extract skills as an array with better parsing
    const skillsText = skillsMatch
      ? skillsMatch[0].replace(/Skills:[\s\n]*/i, '')
      : '';
    const skills = skillsText
      .split(/[-\n,]/) // Split by bullet points, newlines, or commas
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    // Clean up the text fields
    const experience = experienceMatch
      ? experienceMatch[0].replace(/Experience:[\s\n]*/i, '').trim()
      : null;
    const education = educationMatch
      ? educationMatch[0].replace(/Education:[\s\n]*/i, '').trim()
      : null;
    const workHistory = workHistoryMatch
      ? {
          data: workHistoryMatch[0].replace(/Work history:[\s\n]*/i, '').trim(),
        }
      : null;

    console.log('Parsed data before saving:', {
      skillsCount: skills.length,
      skills,
      experience,
      education,
      workHistory,
    });

    // Create or update user profile
    const updatedProfile = await prisma.profile.upsert({
      where: {
        user_id: session.user.id,
      },
      update: {
        cv_url: cvUrl,
        skills: skills.length > 0 ? skills : undefined,
        experience: experience || undefined,
        education: education || undefined,
        work_history: workHistory || undefined,
      },
      create: {
        user_id: session.user.id,
        cv_url: cvUrl,
        skills: skills.length > 0 ? skills : [],
        experience: experience || null,
        education: education || null,
        work_history: workHistory || null,
      },
    });

    console.log('Profile after update:', updatedProfile);

    return NextResponse.json(
      {
        message: 'CV uploaded and analyzed successfully',
        profile: updatedProfile,
        analysis: {
          skills,
          experience,
          education,
          workHistory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing CV:', error);
    return NextResponse.json(
      { message: 'Error processing CV' },
      { status: 500 }
    );
  }
}
