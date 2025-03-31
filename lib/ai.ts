import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCV(cvContent: string) {
  const prompt = `
    Extract the following information from this CV:
    1. Skills (as a list of keywords)
    2. Experience summary (1-2 sentences)
    3. Education summary (1-2 sentences)
    4. Work history (as structured data)

    CV Content:
    ${cvContent.substring(0, 4000)} // Limit content length for API
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a CV analysis assistant. Extract structured information from CVs accurately.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}

export async function getJobRecommendations(userProfile: any, jobs: any[]) {
  const prompt = `
    Given this candidate's profile:
    - Skills: ${userProfile.skills.join(', ')}
    - Experience: ${userProfile.experience || 'Not provided'}
    - Education: ${userProfile.education || 'Not provided'}
    
    Match them with the most relevant job postings from this list:
    ${jobs
      .map(
        (job, index) => `
    Job ${index + 1}:
    - Title: ${job.title}
    - Company: ${job.companyName}
    - Required Skills: ${job.requiredSkills.join(', ')}
    - Description: ${job.description.substring(0, 200)}...
    - ID: ${job.id}
    `
      )
      .join('\n')}
    
    Return a JSON array with the top 5 job matches, each containing:
    1. jobId: The ID of the job
    2. relevanceScore: A score from 0-100 indicating how well the candidate matches the job
    3. reasons: A brief explanation of why this job is a good match
    
    Only return the JSON array, no other text.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a job matching assistant. Analyze candidate profiles and job listings to find the best matches. Return only valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  try {
    const content = response.choices[0].message.content || '[]';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return [];
  }
}
