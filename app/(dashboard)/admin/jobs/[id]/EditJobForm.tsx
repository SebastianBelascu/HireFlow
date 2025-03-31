'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const JOB_TYPES = [
  'FULLTIME',
  'PARTTIME',
  'CONTRACT',
  'INTERNSHIP',
  'TEMPORARY',
] as const;

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  required_skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  job_type: string;
}

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(job.required_skills || []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title'),
        companyName: formData.get('companyName'),
        location: formData.get('location'),
        jobType: formData.get('jobType'),
        description: formData.get('description'),
        required_skills: skills,
        salary_min: Number(formData.get('salaryMin')) || null,
        salary_max: Number(formData.get('salaryMax')) || null,
      };

      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      toast.success('Job updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      toast.success('Job deleted successfully');
      router.push('/admin/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Edit Job</h2>
        <p className='text-muted-foreground'>Update job listing details</p>
      </div>

      <form onSubmit={onSubmit} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Basic information about the job listing
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Job Title</Label>
              <Input
                id='title'
                name='title'
                defaultValue={job.title}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='companyName'>Company Name</Label>
              <Input
                id='companyName'
                name='companyName'
                defaultValue={job.company_name}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                name='location'
                defaultValue={job.location}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='jobType'>Job Type</Label>
              <Select name='jobType' defaultValue={job.job_type}>
                <SelectTrigger>
                  <SelectValue placeholder='Select job type' />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Detailed information about the job
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='description'>Job Description</Label>
              <Textarea
                id='description'
                name='description'
                defaultValue={job.description}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='skills'>Required Skills</Label>
              <div className='flex gap-2'>
                <Input
                  id='skills'
                  placeholder='e.g. React'
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type='button' onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className='flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm'
                    >
                      {skill}
                      <button
                        type='button'
                        className='ml-1 text-muted-foreground hover:text-foreground'
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='salaryMin'>Minimum Salary</Label>
                <Input
                  type='number'
                  id='salaryMin'
                  name='salaryMin'
                  defaultValue={job.salary_min}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='salaryMax'>Maximum Salary</Label>
                <Input
                  type='number'
                  id='salaryMax'
                  name='salaryMax'
                  defaultValue={job.salary_max}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex gap-4'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Job'}
          </Button>
          <Button
            type='button'
            variant='outline'
            className='text-red-500 hover:text-red-600'
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
