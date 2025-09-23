import { Routes } from '@angular/router';
import { SignUp } from './features/auth/components/sign-up/sign-up';
import { Login } from './features/auth/components/login/login';
import { JobPostings } from './features/applicant/components/job-postings/job-postings';
import { JobListings } from './features/recruiter/components/job-listings/job-listings';
import { Chat } from './shared/components/chat/chat';
import { Results } from './features/recruiter/components/results/results';
import { CandidateProfile } from './features/recruiter/components/candidate-profile/candidate-profile';
import {CreateJobPosting} from './features/recruiter/components/create-job-posting/create-job-posting';

export const routes: Routes = [
  { path: '', component: SignUp },
  { path: 'sign-up', component: SignUp },
  { path: 'login', component: Login },
  { path: 'jobs', component: JobPostings },
  { path: 'jobs/:id', component: Chat },
  { path: 'manage-jobs', component: JobListings },
  { path: 'chat', component: Chat },
  { path: 'results/:id', component: Results },
  { path: 'results/applicant/:id', component: CandidateProfile },
  { path: 'create-job-posting', component: CreateJobPosting }
];
