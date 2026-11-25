import { IconType } from "react-icons";
import {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiBootstrap, SiShadcnui,
  SiNodedotjs, SiExpress, SiNestjs, SiJsonwebtokens, SiMongodb, SiPostgresql, SiMysql,
  SiVercel, SiRender, SiDocker, SiGithubactions, SiGit, SiGithub, SiPostman, SiNpm, SiGreensock, SiFramer,
} from "react-icons/si";
import { FaAws, FaCss3Alt } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";

// Thunder Client has no icon pack entry: a lightning-bolt mark in its brand purple.
const ThunderClient: IconType = (p) => (
  <svg viewBox="0 0 24 24" width={p.size ?? "1em"} height={p.size ?? "1em"} className={p.className} fill="currentColor"><path d="M13.5 2 5 13.2h5.6L9.5 22 19 9.8h-5.7L13.5 2Z" /></svg>
);

// [icon, brand colour]
export const skillIcons: Record<string, [IconType, string]> = {
  "HTML5": [SiHtml5, "#E34F26"], "CSS3": [FaCss3Alt, "#1572B6"], "JavaScript": [SiJavascript, "#F7DF1E"],
  "TypeScript": [SiTypescript, "#3178C6"], "React.js": [SiReact, "#61DAFB"], "Next.js": [SiNextdotjs, "#FFFFFF"],
  "Tailwind CSS": [SiTailwindcss, "#06B6D4"], "Bootstrap": [SiBootstrap, "#7952B3"], "shadcn/ui": [SiShadcnui, "#FFFFFF"],
  "Node.js": [SiNodedotjs, "#5FA04E"], "Express.js": [SiExpress, "#FFFFFF"], "NestJS": [SiNestjs, "#E0234E"],
  "REST APIs": [TbApi, "#FF6C37"], "JWT": [SiJsonwebtokens, "#D63AFF"],
  "MongoDB": [SiMongodb, "#47A248"], "PostgreSQL": [SiPostgresql, "#4169E1"], "MySQL": [SiMysql, "#4479A1"],
  "Vercel": [SiVercel, "#FFFFFF"], "Render": [SiRender, "#46E3B7"], "AWS": [FaAws, "#FF9900"],
  "Docker": [SiDocker, "#2496ED"], "GitHub Actions": [SiGithubactions, "#2088FF"],
  "Git": [SiGit, "#F05032"], "GitHub": [SiGithub, "#FFFFFF"], "VS Code": [VscVscode, "#007ACC"],
  "Postman": [SiPostman, "#FF6C37"], "Thunder Client": [ThunderClient, "#7B61FF"], "npm": [SiNpm, "#CB3837"],
  "GSAP": [SiGreensock, "#88CE02"], "Framer Motion": [SiFramer, "#FFFFFF"],
};
