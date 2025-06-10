import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CtaButton } from '../../../../shared/components/cta-button/cta-button';

@Component({
  selector: 'app-sign-up',
  imports: [
    CtaButton,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {

  signUpForm!: FormGroup;
  userRoles = [
    { value: 'candidate', text: 'Postulante' },
    { value: 'recruiter', text: 'Reclutador' }
  ]

  constructor(private formBuilder: FormBuilder) {
    this.signUpForm = this.formBuilder.group({
      name: [],
      lastName: [],
      userRole: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      organization: []
    })
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
      console.log(this.signUpForm.value);
    }
  }
}
