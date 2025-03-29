import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter, expressWrapper } from 'next-connect';
import path from 'path';
import fs from 'fs';
import util from 'util';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractCVInfo,
  getJobRecommendations,
} from '@/lib/cv-processing';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a directory for uploads if it doesn't exist
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// API route handler for CV upload
export async function POST(req: NextRequest) {
  try {
    // For Next.js 13+ API routes, we need to handle file uploads differently
    // This is a simplified approach - in production, consider using a more robust solution
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Extract text based on file type
    let text = '';
    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(filePath);
    } else {
      text = await extractTextFromDOCX(filePath);
    }

    // Extract CV information
    const cvInfo = await extractCVInfo(text);

    // Get job recommendations
    const recommendations = await getJobRecommendations(cvInfo);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    return NextResponse.json({ cvInfo, recommendations }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing CV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process CV' },
      { status: 500 }
    );
  }
}
