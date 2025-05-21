import { Component,inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { AccountService } from '../../../core/service/account.service';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { Roles } from '../../../shared/model/roles';

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule, FormsModule, JsonPipe,NgIf,NgFor],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

    userId : string = "";

    ngOnInit(): void {
      this.getRoles();
      this.userId = this.accountService.currentUser().id;
    }

    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private router = inject(Router);
    private snack = inject(SnackbarService);
    validationErrors?: string[];
    roles : Roles[] = [];

    registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required],
      createdById : [''],
      roleId: ['']
    })
 
    

    getRoles(){
      this.accountService.getRoles().subscribe({
        next: (res: Roles[]) => {
          this.roles = res;
        },
        error: err => {
          console.error('Error fetching roles:', err);
        }
      })
    }

    onSubmit() {
      let findUserId = this.registerForm.get('createdById');
      findUserId?.setValue(this.userId);

      console.log(this.registerForm.value);
      this.accountService.register(this.registerForm.value).subscribe({
        next: res => {
          this.snack.success('Registration successful!.');
          this.router.navigateByUrl('/login');
        },
        error: err => {
          this.validationErrors = err;
          console.log(err);
        }
      })  
    }
}
