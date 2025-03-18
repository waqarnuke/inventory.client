import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  router = inject(Router)
  
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
}
