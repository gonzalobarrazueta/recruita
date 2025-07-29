import {Component, ElementRef, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [
    RouterLink
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss'
})
export class Results {

  top_candidates = [
  ]

  additional_candidates = [
  ]

  @ViewChild('scrollableList', { static: false }) scrollContainer!: ElementRef;

  scrollRight(){
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(){
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }
}
