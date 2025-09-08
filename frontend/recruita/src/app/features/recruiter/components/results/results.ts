import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { Applicant } from '../../../../models/applicant';
import {JobMatching} from '../../services/job-matching';
import {EMPTY, filter, from, switchMap} from 'rxjs';
import {Users} from '../../../../shared/services/users';

@Component({
  selector: 'app-results',
  imports: [
    RouterLink
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss'
})
export class Results {

  jobPostingId!: string | null;
  topCandidates: Applicant[] = [];
  additionalCandidates: Applicant[] = [];
  noCandidates: boolean = true;

  @ViewChild('scrollableList', { static: false }) scrollContainer!: ElementRef;

  constructor(
    private jobMatchingService: JobMatching,
    private usersService: Users,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.jobPostingId = this.route.snapshot.paramMap.get('id');

    if (this.jobPostingId) {
      this.jobMatchingService.getJobMatchesByJobPosting(this.jobPostingId as string)
        .pipe(
          switchMap((matches: any) => {
            if (!matches || matches.length === 0) {
              return EMPTY;
            } else {
              this.noCandidates = false;
              return from(matches);
            }
          }),
          filter((match: any) => (match["match_percentage"] >= 0.75)),
          switchMap((match: any) => this.usersService.getUserById(match["applicant_id"]))
        )
        .subscribe(user => {
          this.topCandidates.push({
            userId: user["id"],
            pfp: user["pfp_image"],
            name: `${user["name"]} ${user["last_name"]}`,
            experience: 0,
            skills: ""
          });
        });
    } else {
      console.error("No job posting ID found in route");
    }
  }

  scrollRight(){
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(){
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }
}
