export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability?: string;
  profile: "Public" | "Private";
  profilePhotoURL?: string;
  rating: number;
}

export interface SkillRequest {
  id: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  fromSkill: string;
  toSkill: string;
  fromProfilePhotoURL?: string;
  message?: string;
  status: "Pending" | "Accepted" | "Rejected";
  timestamp: Date;
}

export interface Feedback {
  id: string;
  from: string;
  to: string;
  rating: number;
  feedback?: string;
  timestamp: Date;
}
