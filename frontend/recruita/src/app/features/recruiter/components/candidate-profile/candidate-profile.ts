import {Component, Signal, signal} from '@angular/core';
import {Users} from '../../../../shared/services/users';
import {ActivatedRoute} from '@angular/router';
import {Applicant} from '../../../../models/applicant';

@Component({
  selector: 'app-candidate-profile',
  imports: [],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.scss'
})
export class CandidateProfile {

  userId = signal("");
  candidate: Applicant = {} as Applicant;

  constructor(
    private usersService: Users,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.userId.set(params["id"]);

        this.usersService.getUserById(this.userId())
          .subscribe(data => {
            this.candidate.userId = data["id"];
            this.candidate.pfp = data["pfp_image"];
            this.candidate.name = `${data["name"]} ${data["last_name"]}`;
            this.candidate.email = data["email"];
            this.candidate.phoneNumber = data["phone_number"];
          });
      }
    );
  }
}
