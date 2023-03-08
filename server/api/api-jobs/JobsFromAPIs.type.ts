import { Company, ExperienceLevel, Job, Role, Location, Benefit, Tech, Duration } from '@prisma/client'

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

export interface FourDayWeekJob {
  title_original: string;
    title: string;
    description: string;
    is_remote: boolean;
    location_original: string;
    location_country: string;
    location_continent: string;
    posted: number;
    reduced_hours: string;
    category: string;
    role: string;
    filters: {
      label: string;
      value: string;
    }[];
    company_name: string;
    hours: number;
    url: string;
    slug: string;
    company_id: number;
    id_str: number;
    company: {
      id_str: number;
      url: string;
      name: string;
      category: string;
      short_description: string;
      description: string;
      slug: string;
      country: string;
      employees: number;
      logo_url: string;
      company_url: string;
      reduced_hours: string;
      four_day_reference_text: string;
      images: string[];
      remote_level: string;
    };
}

export interface RemoteOkJob {
  slug: string;
  id: string;
  epoch: number;
  date: Date;
  company: string;
  company_logo: string;
  position: string;
  tags: string[];
  logo: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  original?: boolean;
  url: string;
  apply_url: string;
}

export interface JobFromAPIs extends Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'companyId' | 'durationId' | 'roleId' | 'experienceLevelId'> {
  company: Omit<Company, 'id'>;

  locations: Omit<Location, 'id'>[];

  duration: Omit<Duration, 'id'>;

  experienceLevel: Omit<ExperienceLevel, 'id'>;

  role: Omit<Role, 'id'>;

  tech: Omit<Tech, 'id'>[];

  benefits: Omit<Benefit, 'id'>[];
}
