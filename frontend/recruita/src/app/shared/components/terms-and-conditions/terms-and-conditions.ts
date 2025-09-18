import {Component, Input, output} from '@angular/core';
import {Users} from '../../services/users';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.scss'
})
export class TermsAndConditions {

  @Input() userId!: string;
  termsAndConditionsAccepted = output<boolean>();

  constructor(private usersService: Users) {
  }

  acceptTermsAndConditions() {
    this.usersService.acceptTermsAndConditions(this.userId, true)
      .subscribe((response: any) => {
        if (response.status === 204) {
          this.termsAndConditionsAccepted.emit(true);
        } else {
          console.log('Error updating TermsAndConditions');
        }
      });
  }

  declineTermsAndConditions() {
    this.usersService.acceptTermsAndConditions(this.userId, false)
      .subscribe((response: any) => {
        if (response.status === 204) {
          this.termsAndConditionsAccepted.emit(false);
        } else {
          console.log('Error updating TermsAndConditions');
        }
      });
  }
}
