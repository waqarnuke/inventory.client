import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/service/account.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  router = inject(Router)
  private activeRoute = inject(Router); 
  returnUrl: string = '/dashboard';
  
  constructor() {
    const url = this.activeRoute.routerState.snapshot.root.queryParams['returnUrl'];
    if (url) {
      this.returnUrl = url;
    }
    
  }
  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });

  loginObj : any ={
    userName :'',
    password:''
  }

  onLogin()
  {
    if(this.loginObj.userName === 'admin' && this.loginObj.password === '1234'){
      this.router.navigateByUrl('/dashboard')
    }
    else{
      alert('wrong credentials')
    }
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: res => {
        this.accountService.getUserInfo().subscribe();
        this.router.navigateByUrl('/dashboard');
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
