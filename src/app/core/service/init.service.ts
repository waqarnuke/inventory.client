import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accoutService = inject(AccountService);

  init() {
    const user = this.accoutService.getUserInfo();
    return user;
  }
}
