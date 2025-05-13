import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Address, User } from '../../shared/model/user';
import { environment } from '../../../environments/environment';
import { map, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.umisApiUrl;
  private http = inject(HttpClient);
  currentUser = signal<any>(null);

  login(vlaues: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', vlaues, {params});
  }

  register(vlaues: any) {
    return this.http.post(this.baseUrl + 'account/register', vlaues);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-Info').pipe(
      map(user => {
        // console.log(user);
        this.currentUser.set(user);
        return user;
      })
    )
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {});
  }

  updateAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  getAuthStatus(){
    return this.http.get<{isAuthenticated:boolean}>(this.baseUrl + 'account/auth-status');
  }
}
