import Job from '../models/Job.js';

export const seedJobs = async () => {
  const existing = await Job.countDocuments();
  if (existing > 0) return;

  await Job.create([
    {
      companyName: 'Google',
      role: 'Software Engineer',
      description: 'Build scalable products for global users.',
      location: 'Mountain View, CA',
      salary: '$140k - $180k',
      deadline: '2026-08-30',
      requirements: ['React', 'Node.js', 'System Design'],
      logo: 'https://logo.clearbit.com/google.com',
    },
    {
      companyName: 'Microsoft',
      role: 'Frontend Developer',
      description: 'Create amazing user interfaces and developer tools.',
      location: 'Redmond, WA',
      salary: '$120k - $160k',
      deadline: '2026-09-10',
      requirements: ['React', 'TypeScript', 'UI Design'],
      logo: 'https://logo.clearbit.com/microsoft.com',
    },
    {
      companyName: 'Amazon',
      role: 'Data Analyst',
      description: 'Analyze customer insights and business metrics.',
      location: 'Seattle, WA',
      salary: '$100k - $140k',
      deadline: '2026-09-15',
      requirements: ['SQL', 'Python', 'Analytics'],
      logo: 'https://logo.clearbit.com/amazon.com',
    },
  ]);
};
