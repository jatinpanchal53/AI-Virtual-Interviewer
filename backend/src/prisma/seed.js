import prisma from './client.js';
import bcrypt from 'bcryptjs';

export const PRESET_ROLES = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    icon: 'Layout',
    category: 'Engineering',
    description: 'Modern web development with React, TypeScript, state management, and web performance.',
    skills: ['React', 'JavaScript/TypeScript', 'CSS/Tailwind', 'Performance Optimization', 'Web APIs', 'State Management'],
    interviewTypes: ['Technical', 'HR', 'Mixed'],
    defaultQuestions: 5
  },
  {
    id: 'python-dev',
    title: 'Python Developer',
    icon: 'Code2',
    category: 'Engineering',
    description: 'Backend, automation, and APIs using Python, FastAPI/Django, AsyncIO, and OOP patterns.',
    skills: ['Python 3.x', 'FastAPI/Django', 'Data Structures', 'AsyncIO & Concurrency', 'OOP & Design Patterns', 'Databases'],
    interviewTypes: ['Technical', 'HR', 'Mixed'],
    defaultQuestions: 5
  },
  {
    id: 'java-dev',
    title: 'Java Developer',
    icon: 'Coffee',
    category: 'Engineering',
    description: 'Enterprise backend systems with Java, Spring Boot, microservices, and multithreading.',
    skills: ['Java Core', 'Spring Boot', 'Multithreading', 'JVM Internals', 'Microservices', 'Hibernate/JPA'],
    interviewTypes: ['Technical', 'HR', 'Mixed'],
    defaultQuestions: 5
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: 'BarChart3',
    category: 'Data',
    description: 'Data transformation, SQL querying, statistical analysis, and dashboard storytelling.',
    skills: ['SQL Joins & Aggregations', 'Python/Pandas', 'Statistics', 'Tableau/PowerBI', 'Data Cleaning', 'A/B Testing'],
    interviewTypes: ['Technical', 'HR', 'Mixed'],
    defaultQuestions: 5
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    icon: 'Layers',
    category: 'Engineering',
    description: 'End-to-end applications with React, Node.js, databases, caching, and cloud deployments.',
    skills: ['React/Next.js', 'Node.js/Express', 'PostgreSQL/MongoDB', 'API Security', 'System Architecture', 'CI/CD'],
    interviewTypes: ['Technical', 'HR', 'Mixed'],
    defaultQuestions: 5
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud Engineer',
    icon: 'Cloud',
    category: 'Infrastructure',
    description: 'Cloud architecture, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.',
    skills: ['Docker & Kubernetes', 'AWS / Azure / GCP', 'CI/CD Pipelines', 'Terraform', 'Monitoring & Observability', 'Linux'],
    interviewTypes: ['Technical', 'HR', 'Mixed'],
    defaultQuestions: 5
  },
  {
    id: 'hr-behavioral',
    title: 'HR & Behavioral',
    icon: 'Users',
    category: 'Behavioral',
    description: 'Culture fit, conflict management, leadership principles, and workplace communication.',
    skills: ['STAR Method', 'Conflict Resolution', 'Cross-functional Collaboration', 'Leadership', 'Time Management'],
    interviewTypes: ['HR'],
    defaultQuestions: 5
  }
];

async function main() {
  console.log('Seeding initial demo user...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('demo1234', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@interviewai.dev' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'demo@interviewai.dev',
      passwordHash
    }
  });

  console.log(`Demo user ready: ${demoUser.email} (password: demo1234)`);
}

if (process.argv[1]?.endsWith('seed.js')) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
