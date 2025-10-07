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
  showPassword: boolean = false;
  showErrorMessage: boolean = false;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(email: string, password: string) {
    this.showErrorMessage = false;
    this.loading = true;

    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.loading = false;
        const accessToken = data.access_token;
        localStorage.setItem('access_token', accessToken);

        // Check if the user is a recruiter or candidate
        this.authService.getUser().subscribe( {
          next: (data) => {
            let user = data.user;
            this.authService.setRole(user.role);

            this.authService.setCurrentUser({
              id: user.id,
              role: user.role,
              token: accessToken
            });

            if (user.role == 'applicant') {
              this.router.navigate(['/jobs']);
            } else { // user is a recruiter
              this.router.navigate(['/manage-jobs']);
            }
          }
        });
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.showErrorMessage = true;
        }
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
