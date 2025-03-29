import OpenAI from 'openai';
import { CVInfo, JobRecommendation } from './models';
import { prisma } from './prisma';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from a DOCX file
 */
export async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Extract CV information using OpenAI
 */
export async function extractCVInfo(text: string): Promise<CVInfo> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a CV parser. Extract the following information from the CV text: name, contact information (email, phone), work experience (job titles, companies, years), skills, certifications, and education background. Format the response as a structured JSON object.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}') as CVInfo;
  } catch (error) {
    console.error('Error extracting CV info:', error);
    throw new Error('Failed to extract information from CV');
  }
}

/**
 * Get job recommendations using OpenAI
 */
export async function getJobRecommendations(
  cvInfo: CVInfo
): Promise<JobRecommendation[]> {
  try {
    // Get available jobs from the database
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        description: true,
        salary: true,
      },
    });

    if (jobs.length === 0) {
      return [];
    }

    // Create a prompt with CV info and available jobs
    const prompt = `Given this candidate's experience and skills, recommend suitable job positions based on the following job database: ${JSON.stringify(
      jobs
    )}. 
    
    Candidate information: ${JSON.stringify(cvInfo)}
    
    Return a JSON array of job IDs ranked by relevance, with a match percentage and a brief explanation for each match. Format: [{"jobId": "id", "matchPercentage": 95, "explanation": "This job matches the candidate's experience in..."}]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a job matching assistant. Your task is to match candidate profiles with suitable job positions based on their skills, experience, and qualifications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const recommendations = JSON.parse(
      response.choices[0].message.content || '[]'
    );

    // Fetch full job details for the recommended jobs
    const recommendedJobs = await Promise.all(
      recommendations.map(async (rec: any) => {
        const job = await prisma.job.findUnique({
          where: { id: rec.jobId },
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            description: true,
            salary: true,
          },
        });

        if (!job) return null;

        return {
          ...job,
          matchPercentage: rec.matchPercentage,
          explanation: rec.explanation,
        };
      })
    );

    // Filter out any null values (jobs that weren't found)
    return recommendedJobs.filter((job) => job !== null) as JobRecommendation[];
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    throw new Error('Failed to get job recommendations');
  }
}

/**
 * Save user feedback on job recommendations
 */
export async function saveUserFeedback(
  userId: string,
  jobId: string,
  liked: boolean
): Promise<void> {
  try {
    // In a real implementation, you would save this to a database
    console.log(`User ${userId} ${liked ? 'liked' : 'disliked'} job ${jobId}`);

    // This would be implemented when we have a feedback table in the database
    // await prisma.feedback.upsert({
    //   where: {
    //     userId_jobId: {
    //       userId,
    //       jobId,
    //     },
    //   },
    //   update: {
    //     liked,
    //   },
    //   create: {
    //     userId,
    //     jobId,
    //     liked,
    //   },
    // });
  } catch (error) {
    console.error('Error saving user feedback:', error);
    throw new Error('Failed to save user feedback');
  }
}
