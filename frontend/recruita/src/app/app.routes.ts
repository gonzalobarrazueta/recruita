import { Routes } from '@angular/router';
import { SignUp } from './features/auth/components/sign-up/sign-up';
import { Login } from './features/auth/components/login/login';
import { JobPostings } from './features/applicant/components/job-postings/job-postings';
import { JobListings } from './features/recruiter/job-listings/job-listings';
import { Chat } from './shared/components/chat/chat';

export const routes: Routes = [
  { path: '', component: SignUp },
  { path: 'sign-up', component: SignUp },
  { path: 'login', component: Login },
  { path: 'jobs', component: JobPostings },
  { path: 'manage-jobs', component: JobListings },
  { path: 'chat', component: Chat }
];
