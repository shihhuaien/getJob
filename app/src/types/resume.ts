/** 履歷結構化內容型別 */

export interface ResumePersonal {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface ResumeContent {
  personal: ResumePersonal;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: string[];
}

export const emptyResumeContent: ResumeContent = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
};
