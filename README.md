# HireFlow - AI-Powered Recruitment Platform

HireFlow is an intelligent recruitment platform that helps employers find, evaluate, and hire the best talent faster. This project includes a CV analysis and job recommendation system that uses OpenAI to match candidates with suitable job positions.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **CV Upload & Parsing**: Upload CVs in PDF or DOCX format and extract key information
- **AI-Powered Job Matching**: Use OpenAI to analyze CVs and recommend suitable jobs
- **Job Recommendations Display**: View personalized job recommendations with match percentages
- **User Feedback System**: Rate job recommendations to improve future suggestions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account for authentication
- OpenAI API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/hireflow"
DIRECT_URL="postgresql://username:password@localhost:5432/hireflow"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
OPENAI_API_KEY="your-openai-api-key"
```

### Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
