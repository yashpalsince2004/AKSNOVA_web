/**
 * Course and Program Information for the Chatbot
 * Source of truth: Professional_Diploma_Programs.pdf & AKSNOVA Offerings
 */

export interface ProgramData {
  professionalDiplomaPrograms: string[];
  advancedItCertificationCourses: string[];
}

export const DIPLOMA_PROGRAMS_DATA: ProgramData = {
  professionalDiplomaPrograms: [
    "Diploma Program in Data Science with AI",
    "Diploma Program in Full Stack Python with Django",
    "Diploma Program in Full Stack Java",
    "Diploma Program in Full Stack Development",
    "Diploma Program in Cloud Computing",
    "Diploma Program in Software Testing",
    "Diploma Program in Digital Marketing",
    "Data Analyst",
  ],
  advancedItCertificationCourses: [
    "Python",
    "Machine Learning",
    "Artificial Intelligence",
    "SQL",
    "Power BI",
    "Tableau",
    "Manual Testing",
    "Automation Testing",
    "Core Java and Java",
    "Web Design and Web Development",
    "Bootstrap, React JS, Django, MongoDB, and WordPress",
    "CCNA, CEH v13, Penetration Testing (PT), Linux/RHCE, AWS, and Azure",
    "Digital Marketing",
  ],
};

export const INITIAL_USER_QUESTIONS = [
  "I am looking for career growth/transition",
  "Learn about AKSNOVA programs",
  "I am just exploring",
] as const;

export const EXPLORING_FOLLOWUP_OPTIONS = [
  "Not sure of a specific program",
  "I'm just looking around",
  "Wish to talk to counselor",
] as const;

/**
 * Specialized career-focused course tracks provided by AKSNOVA.
 */
export const AKSNOVA_DOMAIN_OPTIONS = [
  "Data Science & Analytics",
  "ML & AI",
  "Software & Technology",
  "Cloud Computing & DevOps",
  "Cyber Security",
  "Software Testing",
  "Digital Marketing",
  "Accounting (Tally & GST)",
  "Graphic Design & UI/UX",
] as const;

export const DOMAIN_DETAILS: Record<string, { summary: string; slug: string }> = {
  "Data Science & Analytics": {
    summary:
      "Our Data Science & Analytics track includes the Diploma in Data Science with AI and Data Analyst programs covering Python, SQL, Power BI, Tableau, Machine Learning, and live business analytics capstones.",
    slug: "/courses/data-science-ai",
  },
  "ML & AI": {
    summary:
      "Our ML & AI curriculum covers Machine Learning algorithms, Deep Learning, Generative AI models, NLP, and Computer Vision with end-to-end model deployments.",
    slug: "/courses/data-science-ai",
  },
  "Software & Technology": {
    summary:
      "Our Full Stack Software track offers Diploma Programs in Full Stack Python with Django, Full Stack Java, and modern MERN architectures with real-world SaaS portfolio projects.",
    slug: "/courses/full-stack-development",
  },
  "Cloud Computing & DevOps": {
    summary:
      "Master cloud infrastructure with hands-on AWS, Azure, Linux/RHCE, Docker, Kubernetes, and CI/CD pipelines with real-time enterprise architectures.",
    slug: "/courses/cloud-devops",
  },
  "Cyber Security": {
    summary:
      "Train in Ethical Hacking, CEH v13, Penetration Testing (PT), Network Security, and CCNA in dedicated defensive and offensive cybersecurity labs.",
    slug: "/courses/cyber-security",
  },
  "Software Testing": {
    summary:
      "Comprehensive Software Testing diploma covering Manual Testing, Automation Testing with Selenium & Java, API Testing with Postman, and Jira test management.",
    slug: "/courses",
  },
  "Digital Marketing": {
    summary:
      "Diploma Program in Digital Marketing covering Search Engine Optimization (SEO), SEM, Performance Marketing, Social Media Marketing, and Google Analytics.",
    slug: "/courses",
  },
  "Accounting (Tally & GST)": {
    summary:
      "Practical accounting training covering Tally Prime, GST filing, TDS compliance, E-Way bills, payroll, and corporate auditing workflows.",
    slug: "/courses/accounting-tally-gst",
  },
  "Graphic Design & UI/UX": {
    summary:
      "Professional design training in Adobe Photoshop, Illustrator, CorelDraw, Figma, and modern UI/UX design workflows with portfolio curation.",
    slug: "/courses/graphic-design",
  },
};

export const DEFAULT_MESSAGES = {
  aksnova: {
    welcome: `Hey! Welcome to AKSNOVA!\n\nAb Aage Ki Socho 🤔💭 and start exploring.`,
    programsIntro: `We have a wide range of programs for you across Data Science, Full Stack Development, Cloud Computing, Cyber Security, and Advanced IT Certifications.\n\nAre you ready to start upskilling?`,
  },
} as const;
