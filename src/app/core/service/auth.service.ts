import { Injectable } from '@angular/core';
import { User } from '../../shared/model/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() { }

  // auth.service.ts
  private currentUser = new BehaviorSubject<User | null>(null);

  setUser(user: User) {
    this.currentUser.next(user);
  }

  getUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  getUserRole(): string {
    return this.currentUser.value?.roles || '';
  }

}
