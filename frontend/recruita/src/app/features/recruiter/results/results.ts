import {Component, ElementRef, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import { Applicant } from '../../../models/applicant';

@Component({
  selector: 'app-results',
  imports: [
    RouterLink
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss'
})
export class Results {

  top_candidates: Applicant[] = []

  additional_candidates: Applicant[] = []

  @ViewChild('scrollableList', { static: false }) scrollContainer!: ElementRef;

  scrollRight(){
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(){
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }
}
