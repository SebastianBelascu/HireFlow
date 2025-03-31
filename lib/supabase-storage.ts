import { createClient } from '@supabase/supabase-js';
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Test function to check bucket access
export async function testBucketAccess() {
  const { data, error } = await supabase.storage.from('cvs').list();

  if (error) {
    console.error('Error accessing bucket:', error);
    throw error;
  }

  console.log('Successfully accessed bucket. Contents:', data);
  return data;
}

export async function uploadCV(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('cvs').getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

export async function getCVContent(filePath: string) {
  try {
    // Download the file from Supabase
    const { data, error } = await supabase.storage
      .from('cvs')
      .download(filePath);

    if (error) {
      console.error('Error downloading CV:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data received from storage');
    }

    // Get the file extension from the path
    const fileExt = filePath.split('.').pop()?.toLowerCase();

    // Handle different file types
    if (fileExt === 'pdf') {
      // For PDF files, use pdf-parse
      const buffer = await data.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      const pdfData = await pdfParse(uint8Array);
      return pdfData.text;
    } else if (fileExt === 'txt') {
      // For text files, just get the text
      return await data.text();
    } else if (fileExt === 'doc' || fileExt === 'docx') {
      // For Word documents, we'll need to inform the user we don't support them yet
      throw new Error(
        'Word documents are not supported yet. Please upload a PDF file.'
      );
    } else {
      throw new Error(
        'Unsupported file type. Please upload a PDF or text file.'
      );
    }
  } catch (error) {
    console.error('Error extracting CV content:', error);
    throw error;
  }
}

export async function deleteCV(filePath: string) {
  const { error } = await supabase.storage.from('cvs').remove([filePath]);

  if (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
}
