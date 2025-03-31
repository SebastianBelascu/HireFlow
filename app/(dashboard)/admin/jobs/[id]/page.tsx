import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditJobForm from './EditJobForm';

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.job.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!job) {
    notFound();
  }

  return <EditJobForm job={job} />;
}
