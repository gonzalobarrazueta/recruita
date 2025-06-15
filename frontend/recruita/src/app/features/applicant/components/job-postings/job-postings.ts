import { Component, ElementRef, ViewChild } from '@angular/core';
import { JobPosting } from '../../../../models/job-posting';

@Component({
  selector: 'app-job-postings',
  imports: [],
  templateUrl: './job-postings.html',
  styleUrl: './job-postings.scss'
})
export class JobPostings {

  jobPostings: JobPosting[] = [];

  @ViewChild('scrollableList', { static: false }) scrollContainer!: ElementRef;

  scrollRight(){
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(){
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });

  }
}
