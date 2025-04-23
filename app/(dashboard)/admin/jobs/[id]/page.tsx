import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditJobForm from './EditJobForm';

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const jobId = await params.id;
  
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    notFound();
  }

  return <EditJobForm job={job} />;
}
