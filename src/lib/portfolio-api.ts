import { apiRequest } from "./api";

export type Experience = {
  id: number;
  company: string;
  role: string;
  description: string;
  period: string;
  sortOrder: number;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
  sortOrder: number;
};

export type Education = {
  id: number;
  degree: string;
  school: string;
  description: string;
  period: string;
  sortOrder: number;
};

export type ProjectDetail = {
  label: string;
  value: string;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  objectives: string;
  stack: string[];
  features: string[];
  details: ProjectDetail[];
  githubUrl: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

export type PortfolioData = {
  profile: { photoUrl: string | null };
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
  projects: Project[];
};

export function fetchPortfolio() {
  return apiRequest<PortfolioData>("/api/portfolio");
}

export function fetchProject(id: number) {
  return apiRequest<Project>(`/api/portfolio/projects/${id}`);
}
