import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/service/account.service';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../core/service/snackbar.service';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, RouterLink,JsonPipe,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  validationErrors?: string[];

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['',Validators.required],
    email: ['',Validators.required, Validators.email],
    password: ['',Validators.required]
  })

  onSubmit() {
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe({
      next: res => {
        this.snack.success('Registration successful! Please login to continue.');
        this.router.navigateByUrl('/login');
      },
      error: err => {
        this.validationErrors = err;
        console.log(err);
      }
    })  
  }
}
