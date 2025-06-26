import { Component, ElementRef, ViewChild } from '@angular/core';
import { JobPosting } from '../../../../models/job-posting';
import { Jobs } from '../../../../shared/services/jobs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-postings',
  imports: [
    RouterLink
  ],
  templateUrl: './job-postings.html',
  styleUrl: './job-postings.scss'
})
export class JobPostings {

  jobPostings: JobPosting[] = [];

  constructor(private jobsService: Jobs) {
    this.jobsService.getJobs().subscribe(jobs => {
      this.jobPostings = jobs;
    });
  }

  @ViewChild('scrollableList', { static: false }) scrollContainer!: ElementRef;

  scrollRight(){
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(){
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }
}
