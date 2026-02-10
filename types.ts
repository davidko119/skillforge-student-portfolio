
export enum UserRole {
  STUDENT = 'STUDENT',
  CREATOR = 'CREATOR'
}

export type AppTheme = 'MODERN_DARK' | 'ELEGANT_LIGHT';

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Rodný jazyk';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  detailedDescription?: string;
  galleryImages?: string[];
  tags?: string[];
}

export interface PortfolioConfig {
  layout: 'STANDARD' | 'GRID' | 'MINIMAL';
  theme: 'BLUE' | 'PURPLE' | 'ORANGE' | 'GREEN' | 'NEUTRAL';
  font: 'INTER' | 'JAKARTA' | 'SPACE' | 'PLAYFAIR';
}

export interface UserPreferences {
  interests: string[];
  preferredLocations: string[];
  opportunityTypes: string[];
  fieldOfStudy: string;
  languages: string[];
  degreeLevel: string;
  workPreference: 'REMOTE' | 'ON-SITE' | 'HYBRID' | 'ANY';
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  role: UserRole;
  skills: string[];
  certificates: Certificate[];
  avatarUrl?: string;
  headline?: string;
  projects?: Project[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  portfolioConfig?: PortfolioConfig;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  preferences?: UserPreferences;
  savedOpportunityIds: string[];
  // Minimal auth field stored in Appwrite (hash hesla)
  passwordHash?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Erasmus' | 'Stáž' | 'Workshop' | 'Súťaž' | 'Iné';
  date: string;
  description: string;
  location: string;
  imageUrl?: string;
  applyLink?: string;
  tags: string[];
  sourceUrls?: string[];
  fullContent?: string;
  steps?: string[];
  whatToExpect?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  questions: QuizQuestion[];
  completedBy: string[];
}

export type View = 'LANDING' | 'DASHBOARD' | 'PROFILE' | 'CALENDAR' | 'QUIZZES' | 'CREATOR_HUB' | 'QUIZ_PLAYER' | 'AUTH' | 'PORTFOLIO_PREVIEW';
