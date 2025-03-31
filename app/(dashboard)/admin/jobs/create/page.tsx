interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  description: string;
  required_skills: string[];
  salary_min: number | null;
  salary_max: number | null;
}

export default function CreateJobPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        title: formData.get('title') as string,
        company_name: formData.get('company_name') as string,
        location: formData.get('location') as string,
        job_type: formData.get('job_type') as string,
        description: formData.get('description') as string,
        required_skills: skills,
        salary_min: formData.get('salary_min')
          ? Number(formData.get('salary_min'))
          : null,
        salary_max: formData.get('salary_max')
          ? Number(formData.get('salary_max'))
          : null,
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const result = await response.json();
      toast({
        title: 'Success',
        description: 'Job created successfully',
      });
      router.push(`/jobs/${result.id}`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Create Job</h2>
        <p className='text-muted-foreground'>
          Add a new job posting to the platform
        </p>
      </div>

      <form onSubmit={onSubmit} className='space-y-8'>
        <div className='space-y-4'>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Job Title</Label>
              <Input
                id='title'
                name='title'
                placeholder='e.g. Senior Software Engineer'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='company_name'>Company Name</Label>
              <Input
                id='company_name'
                name='company_name'
                placeholder='e.g. Acme Inc.'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                name='location'
                placeholder='e.g. San Francisco, CA'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='job_type'>Job Type</Label>
              <Select name='job_type' required>
                <SelectTrigger>
                  <SelectValue placeholder='Select job type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='FULL_TIME'>Full Time</SelectItem>
                  <SelectItem value='PART_TIME'>Part Time</SelectItem>
                  <SelectItem value='CONTRACT'>Contract</SelectItem>
                  <SelectItem value='INTERNSHIP'>Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label>Salary Range</Label>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Input
                    type='number'
                    name='salary_min'
                    placeholder='Min salary'
                  />
                </div>
                <div>
                  <Input
                    type='number'
                    name='salary_max'
                    placeholder='Max salary'
                  />
                </div>
              </div>
            </div>

            <div className='grid gap-2'>
              <Label>Required Skills</Label>
              <div className='flex gap-2'>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder='Add a skill'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleAddSkill}
                >
                  Add
                </Button>
              </div>
              <div className='flex flex-wrap gap-2 mt-2'>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className='group flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs'
                  >
                    {skill}
                    <X
                      className='h-3 w-3 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100'
                      onClick={() => handleRemoveSkill(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Job Description</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Write the job description in Markdown format...'
                className='min-h-[200px]'
                required
              />
            </div>
          </div>
        </div>

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating...
            </>
          ) : (
            'Create Job'
          )}
        </Button>
      </form>
    </div>
  );
}
