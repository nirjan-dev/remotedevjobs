import { Company, ExperienceLevel, Job, Role, Location } from '@prisma/client'

export interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  company_logo_url: string;
}

export interface jobWithLinkedData extends Omit<Job, 'company_id' | 'location_id' | 'duration_id' | 'experienceLevel_id' | 'role_id'> {
  company: Company;
  locations: Location[];
  duration: Duration;
  experienceLevel: ExperienceLevel;
  role: Role;
}
