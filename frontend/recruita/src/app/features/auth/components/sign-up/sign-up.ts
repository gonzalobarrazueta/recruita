import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CtaButton } from '../../../../shared/components/cta-button/cta-button';
import { Router, RouterLink } from '@angular/router';
import {Auth} from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  imports: [
    CtaButton,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {

  signUpForm!: FormGroup;
  userRoles = [
    { value: 'applicant', text: 'Postulante' },
    { value: 'recruiter', text: 'Reclutador' }
  ]

  constructor(private formBuilder: FormBuilder, private authService: Auth, private router: Router) {
    this.signUpForm = this.formBuilder.group({
      name: [],
      lastName: [],
      phoneNumber: [],
      userRole: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      organization: []
    })
  }

  register(name: string, lastName: string, phoneNumber: string, email: string, password: string, role: string, organization: string) {
    this.authService.register(name, lastName, phoneNumber, email, password, role, organization).subscribe({
      next: (data) => {
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
      }
    });
  }

  getControlError(controlName: string): string | null {
    const control = this.signUpForm.get(controlName);
    if (control && control?.touched && control?.invalid) {
      if (control?.hasError('required')) return 'Este campo es obligatorio';
      if (control?.hasError('email')) return 'Correo electrónico inválido';
    }
    return null;
  }

  submitForm(): void {
    if (this.signUpForm.valid) {
      this.register(
        this.signUpForm.get('name')?.value,
        this.signUpForm.get('lastName')?.value,
        this.signUpForm.get('phoneNumber')?.value,
        this.signUpForm.get('email')?.value,
        this.signUpForm.get('password')?.value,
        this.signUpForm.get('userRole')?.value,
        this.signUpForm.get('organization')?.value
      );
    }
  }
}
