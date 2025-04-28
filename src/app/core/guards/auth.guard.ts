import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../service/account.service';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if(accountService.currentUser()){
    return of(true  );
  }
  else {
    return accountService.getAuthStatus().pipe(
      map( auth =>{
        if(auth.isAuthenticated){
          return true;
        }
        else {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    )
  }
};
