export interface JobPosting {
  id:string;
  recruiterId: string;
  title: string;
  yearsOfExperience: number;
  category: string;
  companyName: string;
  companyImage: string;
  requirements: string;
  fullDescription: string;
  hasNotifications?: number;
}
