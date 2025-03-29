// Models for CV processing and job recommendations

export interface CVInfo {
  name: string;
  contact: {
    email?: string;
    phone?: string;
  };
  workExperience: Array<{
    title: string;
    company: string;
    years: string;
  }>;
  skills: string[];
  certifications?: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number;
  matchPercentage: number;
  explanation: string;
}

export interface UserFeedback {
  jobId: string;
  userId: string;
  liked: boolean;
  createdAt: Date;
}
