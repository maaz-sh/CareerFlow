export type ApplicationStatus =
  | 'APPLIED'
  | 'RECRUITER_SCREEN'
  | 'TECHNICAL_INTERVIEW'
  | 'FINAL_INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export type WorkplaceType = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export interface JobApplication {
  id: string;
  company: string;
  roleTitle: string;
  status: ApplicationStatus;
  appliedDate: string;
  location?: string;
  workplaceType?: WorkplaceType;
  salaryRange?: string;
  jobPostingUrl?: string;
  description?: string;
  applicantName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Interview {
  id: string;
  applicationId: string;
  interviewType: string;
  scheduledAt: string;
  interviewerNames: string[];
  topics?: string;
  outcome?: string;
  notes?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  applicationId: string;
  company: string;
  name: string;
  email?: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  applicationId: string;
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
}
