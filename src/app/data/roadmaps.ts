export interface Roadmap {
  id: number;
  rank: number;
  title: string;
  skills: string;
  salary: string;
  category: string;
  description?: string;
  steps?: string[];
  duration?: string;
  prerequisites?: string[];
}

export const ALL_ROADMAPS: Roadmap[] = [
  { id: 1, rank: 1, title: "Data Analyst", skills: "SQL, Excel, Power BI", salary: "4.5", category: "Data" },
  { id: 2, rank: 2, title: "AI/ML Engineer", skills: "Python, TensorFlow basics", salary: "7", category: "AI" },
  { id: 3, rank: 3, title: "Cybersecurity Specialist", skills: "Firewalls, ethical hacking", salary: "6", category: "Cybersecurity" },
  { id: 4, rank: 4, title: "DevOps Engineer", skills: "Docker, Jenkins intro", salary: "5.5", category: "Cloud" },
  { id: 5, rank: 5, title: "Full Stack Developer", skills: "MERN stack", salary: "6.5", category: "Development" },
  { id: 6, rank: 6, title: "Cloud Support Engineer", skills: "AWS basics, EC2", salary: "5-7", category: "Cloud" },
  { id: 7, rank: 7, title: "Prompt Engineer", skills: "LLM prompting", salary: "5-8", category: "AI" },
  { id: 8, rank: 8, title: "Data Scientist (Jr)", skills: "Pandas, basic ML", salary: "6-9", category: "Data" },
  { id: 9, rank: 9, title: "UI/UX Designer", skills: "Figma, wireframing", salary: "4-6", category: "UI/UX" },
  { id: 10, rank: 10, title: "Digital Marketing Exec", skills: "SEO, AI tools", salary: "4-7", category: "Marketing" },
  { id: 11, rank: 11, title: "Flutter Developer", skills: "Dart, mobile apps", salary: "5-8", category: "Development" },
  { id: 12, rank: 12, title: "Backend Developer", skills: "Django/Node.js", salary: "5-7", category: "Development" },
  { id: 13, rank: 13, title: "QA Automation Tester", skills: "Selenium", salary: "4.5-6.5", category: "Testing" },
  { id: 14, rank: 14, title: "Blockchain Developer", skills: "Ethereum basics", salary: "5-8", category: "Development" },
  { id: 15, rank: 15, title: "Big Data Analyst", skills: "Spark intro", salary: "6-9", category: "Data" },
  { id: 16, rank: 16, title: "Site Reliability Engineer", skills: "Kubernetes basics", salary: "6-8", category: "Cloud" },
  { id: 17, rank: 17, title: "Android Developer", skills: "Kotlin", salary: "5.5-7.5", category: "Development" },
  { id: 18, rank: 18, title: "iOS Developer", skills: "Swift", salary: "5.5-7.5", category: "Development" },
  { id: 19, rank: 19, title: "AR/VR Developer", skills: "Unity basics", salary: "5-7", category: "Development" },
  { id: 20, rank: 20, title: "ServiceNow Developer", skills: "Workflows", salary: "5-7", category: "Development" },
  { id: 21, rank: 21, title: "Salesforce Admin", skills: "CRM basics", salary: "5-8", category: "Cloud" },
  { id: 22, rank: 22, title: "RPA Developer", skills: "UiPath bots", salary: "4.5-6.5", category: "Automation" },
  { id: 23, rank: 23, title: "BI Analyst", skills: "Tableau", salary: "4-6", category: "Data" },
  { id: 24, rank: 24, title: "Frontend Developer", skills: "React", salary: "5-7", category: "Development" },
  { id: 25, rank: 25, title: "Graphic Designer", skills: "Photoshop", salary: "3.5-5.5", category: "Design" },
  { id: 26, rank: 26, title: "Tally Accountant", skills: "GST invoicing", salary: "3-5", category: "Finance" },
  { id: 27, rank: 27, title: "Network Support", skills: "CCNA basics", salary: "3.5-5", category: "Networking" },
  { id: 28, rank: 28, title: "Data Engineer (Jr)", skills: "ETL pipelines", salary: "6-8", category: "Data" },
  { id: 29, rank: 29, title: "IoT Technician", skills: "Sensors", salary: "5-7", category: "IoT" },
  { id: 30, rank: 30, title: "Semiconductor Tester", skills: "Chip basics", salary: "6-9", category: "Hardware" },
  { id: 31, rank: 31, title: "AI Compliance Analyst", skills: "Ethics, DPDP", salary: "5-7", category: "AI" },
  { id: 32, rank: 32, title: "No-Code Developer", skills: "Bubble apps", salary: "4-6", category: "Development" },
  { id: 33, rank: 33, title: "Game Developer", skills: "Unity C#", salary: "4.5-6.5", category: "Development" },
  { id: 34, rank: 34, title: "Video Editor", skills: "DaVinci Resolve", salary: "4-6", category: "Design" },
  { id: 35, rank: 35, title: "SQL DBA", skills: "Queries", salary: "4-6", category: "Data" },
  { id: 36, rank: 36, title: "Java Developer", skills: "Spring Boot", salary: "5-7", category: "Development" },
  { id: 37, rank: 37, title: "MLOps Engineer", skills: "Model deploy", salary: "6-9", category: "AI" },
  { id: 38, rank: 38, title: "Azure Support", skills: "Microsoft cloud", salary: "5-7", category: "Cloud" },
  { id: 39, rank: 39, title: "GCP Associate", skills: "Google cloud", salary: "5-7", category: "Cloud" },
  { id: 40, rank: 40, title: "Ethical Hacker", skills: "Pen testing", salary: "5.5-7.5", category: "Cybersecurity" },
  { id: 41, rank: 41, title: "Network Security Analyst", skills: "Intrusion detection", salary: "5-7", category: "Cybersecurity" },
  { id: 42, rank: 42, title: "Scrum Master (Jr)", skills: "Agile tools", salary: "4.5-6.5", category: "Management" },
  { id: 43, rank: 43, title: "AI Content Specialist", skills: "Gen AI marketing", salary: "4-6", category: "AI" },
  { id: 44, rank: 44, title: "Mobile Tester", skills: "Appium", salary: "4-6", category: "Testing" },
  { id: 45, rank: 45, title: "Low-Code Developer", skills: "OutSystems", salary: "5-7", category: "Development" },
  { id: 46, rank: 46, title: "Fintech Support", skills: "Payments SQL", salary: "5-7", category: "Finance" },
  { id: 47, rank: 47, title: "Travel Tech Analyst", skills: "OTA APIs", salary: "4.5-6.5", category: "Data" },
  { id: 48, rank: 48, title: "SaaS Support Engineer", skills: "Product ops", salary: "5-8", category: "Cloud" },
  { id: 49, rank: 49, title: "Agentic AI Consultant", skills: "Multi-agent basics", salary: "6-9", category: "AI" },
  { id: 50, rank: 50, title: "Product Analyst (Jr)", skills: "AI strategy", salary: "5-8", category: "Data" },
];

// Detailed roadmap data for top 5
export const DETAILED_ROADMAPS: Record<number, {
  description: string;
  steps: string[];
  duration: string;
  prerequisites: string[];
}> = {
  1: {
    description: "A Data Analyst collects, processes, and performs statistical analyses on large datasets to help organizations make data-driven decisions.",
    steps: [
      "Learn SQL fundamentals (SELECT, JOIN, WHERE, GROUP BY)",
      "Master Excel (Pivot tables, VLOOKUP, formulas)",
      "Learn Power BI or Tableau for visualization",
      "Practice with real datasets",
      "Build a portfolio with 3-5 projects",
      "Apply for entry-level positions"
    ],
    duration: "3-6 months",
    prerequisites: ["Basic math skills", "Logical thinking", "Attention to detail"]
  },
  2: {
    description: "AI/ML Engineers build and deploy machine learning models to solve real-world problems using AI technologies.",
    steps: [
      "Learn Python programming basics",
      "Understand data structures and algorithms",
      "Learn NumPy, Pandas for data manipulation",
      "Study machine learning fundamentals",
      "Practice with TensorFlow or PyTorch",
      "Build ML projects and deploy models",
      "Apply for AI/ML positions"
    ],
    duration: "6-12 months",
    prerequisites: ["Basic programming knowledge", "Math (linear algebra, statistics)", "Problem-solving skills"]
  },
  3: {
    description: "Cybersecurity Specialists protect organizations from cyber threats by implementing security measures and monitoring systems.",
    steps: [
      "Learn networking fundamentals (TCP/IP, OSI model)",
      "Study security concepts (encryption, authentication)",
      "Learn about firewalls and intrusion detection",
      "Practice ethical hacking basics",
      "Get certified (CEH, Security+)",
      "Build security projects",
      "Apply for security roles"
    ],
    duration: "6-9 months",
    prerequisites: ["Networking basics", "Problem-solving", "Attention to detail"]
  },
  4: {
    description: "DevOps Engineers bridge development and operations, automating deployment pipelines and managing infrastructure.",
    steps: [
      "Learn Linux basics and shell scripting",
      "Understand version control (Git)",
      "Learn Docker containerization",
      "Study CI/CD pipelines (Jenkins, GitHub Actions)",
      "Learn cloud basics (AWS/Azure)",
      "Practice infrastructure as code",
      "Apply for DevOps positions"
    ],
    duration: "4-8 months",
    prerequisites: ["Basic Linux knowledge", "Understanding of software development", "Automation mindset"]
  },
  5: {
    description: "Full Stack Developers work on both frontend and backend, building complete web applications.",
    steps: [
      "Learn HTML, CSS, JavaScript fundamentals",
      "Master React for frontend",
      "Learn Node.js and Express for backend",
      "Understand MongoDB database",
      "Build full-stack projects",
      "Learn deployment (Vercel, Heroku)",
      "Create portfolio and apply"
    ],
    duration: "6-10 months",
    prerequisites: ["Logical thinking", "Problem-solving", "Willingness to learn"]
  },
};

// Generate default roadmap data for any roadmap
export function getRoadmapDetails(id: number): {
  description: string;
  steps: string[];
  duration: string;
  prerequisites: string[];
} {
  if (DETAILED_ROADMAPS[id]) {
    return DETAILED_ROADMAPS[id];
  }

  const roadmap = ALL_ROADMAPS.find(r => r.id === id);
  if (!roadmap) {
    return {
      description: "Career roadmap for this IT role.",
      steps: [
        "Learn fundamental skills",
        "Practice with projects",
        "Build portfolio",
        "Apply for positions"
      ],
      duration: "4-8 months",
      prerequisites: ["Basic computer knowledge", "Willingness to learn"]
    };
  }

  // Generate generic steps based on category
  const categorySteps: Record<string, string[]> = {
    "Data": [
      "Learn data analysis fundamentals",
      "Master data tools and SQL",
      "Practice with real datasets",
      "Build data projects",
      "Apply for data roles"
    ],
    "AI": [
      "Learn programming basics",
      "Study AI/ML fundamentals",
      "Practice with AI frameworks",
      "Build AI projects",
      "Apply for AI positions"
    ],
    "Development": [
      "Learn programming languages",
      "Master frameworks and tools",
      "Build projects",
      "Create portfolio",
      "Apply for developer roles"
    ],
    "Cloud": [
      "Learn cloud fundamentals",
      "Get cloud certifications",
      "Practice cloud deployments",
      "Build cloud projects",
      "Apply for cloud positions"
    ],
    "Cybersecurity": [
      "Learn security fundamentals",
      "Study ethical hacking",
      "Get security certifications",
      "Practice security scenarios",
      "Apply for security roles"
    ],
  };

  const defaultSteps = categorySteps[roadmap.category] || [
    "Learn role-specific skills",
    "Practice with projects",
    "Build portfolio",
    "Apply for positions"
  ];

  return {
    description: `Career roadmap for ${roadmap.title}. Build the right skills and get job-ready.`,
    steps: defaultSteps,
    duration: "4-8 months",
    prerequisites: ["Basic computer knowledge", "Willingness to learn"]
  };
}
