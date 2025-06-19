import { Component } from '@angular/core';
import { CtaButton } from '../../../../shared/components/cta-button/cta-button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    CtaButton,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: (data) => {
        localStorage.setItem('access_token', data.access_token);

        // Check if the user is a recruiter or candidate
        this.authService.getUser().subscribe( {
          next: (data) => {
            let user = data.user;
            this.authService.setRole(user.role);

            if (user.role == 'applicant') {
              this.router.navigate(['/jobs']);
            } else { // user is an applicant
              this.router.navigate(['/manage-jobs']);
            }
          }
        });
      }
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );
    }
  }
}
