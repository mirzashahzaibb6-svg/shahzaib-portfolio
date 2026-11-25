// All editable content lives here.
export const site = {
  name: "Shahzaib Iqbal",
  title: "Full Stack Developer",
  location: "Karachi, Pakistan",
  languages: ["Urdu", "English"],
  // EDIT: update this biography whenever you like.
  bio: "I'm Shahzaib Iqbal, a Full Stack Developer based in Karachi, Pakistan. I build complete web applications, from interface to API to database, using React, Next.js, TypeScript, Node.js and modern animation tools. I speak Urdu and English.",
  email: "shahzaibmughal1048@gmail.com",
  phone: "03172174153",
  phoneIntl: "923172174153",
  github: "https://github.com/mirzashahzaibb6-svg",
  linkedin: "https://www.linkedin.com/in/shahzaib-mughal-950b263aa",
};

export const nav = ["home", "about", "services", "skills", "projects", "play", "contact"] as const;

export const education = [
  { title: "Matric", status: "Completed" },
  { title: "ACS", status: "Currently Studying" },
  { title: "SMIT", status: "1.5 Years Course" },
];

export const experience = [
  { role: "JavaScript Instructor", duration: "3 Months", note: "Taught JavaScript to students." },
];

export const services = [
  "Full Stack Web Development", "Frontend Development", "Backend Development", "API Development",
  "UI/UX Design", "Responsive Web Design", "Website Animation & Interactive Effects",
  "GSAP Animation Development", "Framer Motion Animations", "3D Website Experiences",
  "E-commerce Website Development", "REST API Integration", "Database Integration", "Website Optimization",
];

export const skillGroups: { group: string; skills: string[] }[] = [
  { group: "Frontend Development", skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Bootstrap", "shadcn/ui"] },
  { group: "Backend Development", skills: ["Node.js", "Express.js", "NestJS", "REST APIs", "JWT"] },
  { group: "Database", skills: ["MongoDB", "PostgreSQL", "MySQL"] },
  { group: "Deployment & DevOps", skills: ["Vercel", "Render", "AWS", "Docker", "GitHub Actions"] },
  { group: "Development Tools", skills: ["Git", "GitHub", "VS Code", "Postman", "Thunder Client", "npm"] },
  { group: "Animation", skills: ["GSAP", "Framer Motion"] },
];

// EDIT: project slots. Descriptions are based on your screenshots; change freely.
export const projects = [
  {
    index: "01", title: "HCM", accent: "Lite", tag: "Full Stack Project · Live",
    desc: "An AI-assisted human capital management system for employees, attendance, payroll and leave, with role-based login, an executive dashboard and a smart AI assistant.",
    image: "/images/hcm-lite.jpg",
    links: [{ label: "Live Site", href: "https://hcm-lite-frontend-three.vercel.app/" }],
  },
  {
    index: "02", title: "Mirza", accent: "Zaiqa", tag: "Restaurant Website · Live",
    desc: "A tandoor restaurant website with an animated dish showcase, cart and table reservation form.",
    image: "/images/mirza-zaiqa.jpg",
    links: [{ label: "Live Site", href: "https://mirza-zaiqa.vercel.app/" }],
  },
  {
    index: "03", title: "Mirza", accent: "Pestire", tag: "Full-Stack E-Commerce",
    desc: "A bakery e-commerce experience with product collection, quick view, sign in and checkout.",
    image: "/images/mirza-pestire.jpg",
    links: [{ label: "GitHub", href: "https://github.com/mirzashahzaibb6-svg/mirza-pestire" }],
  },
  {
    index: "04", title: "Mirza's", accent: "Natural Store", tag: "Full-Stack E-Commerce",
    desc: "A natural products store with account sign in, product collection and a delivery checkout flow.",
    image: "/images/mirza-natural-store.jpg",
    links: [{ label: "GitHub", href: "https://github.com/mirzashahzaibb6-svg/MIRZA-S-NATURAL-STORE-full-stack-" }],
  },
];
