import { Component, ElementRef, ViewChild } from '@angular/core';
import { JobPosting } from '../../../../models/job-posting';
import { Jobs } from '../../../../shared/services/jobs';
import { RouterLink } from '@angular/router';
import {Users} from '../../../../shared/services/users';
import {TermsAndConditions} from '../../../../shared/components/terms-and-conditions/terms-and-conditions';
import {Auth} from '../../../auth/services/auth';
import {concatMap, EMPTY} from 'rxjs';
import {User} from '../../../auth/models/user';

@Component({
  selector: 'app-job-postings',
  imports: [
    RouterLink,
    TermsAndConditions
  ],
  templateUrl: './job-postings.html',
  styleUrl: './job-postings.scss'
})
export class JobPostings {
  useApp: boolean = false;
  jobPostings: JobPosting[] = [];
  currentUser!: User;

  constructor(private jobsService: Jobs,
              private usersService: Users,
              private authService: Auth
  ) {
    this.jobsService.getJobs().subscribe(jobs => {
      this.jobPostings = jobs;
    });

    this.authService.currentUser$.pipe(
      concatMap(user => {
        if (user) {
          this.currentUser = user;
          return this.usersService.checkTermsAndConditions(this.currentUser.id);
        }
        return EMPTY;
      })
    ).subscribe((response: any) => {
      this.useApp = response["has_accepted"];
    });
  }

  @ViewChild('scrollableList', { static: false }) scrollContainer!: ElementRef;

  scrollRight(){
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(){
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  onTermsAccepted(value: boolean) {
    this.useApp = value;
  }
}
