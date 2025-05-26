import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Address, User } from '../../shared/model/user';
import { environment } from '../../../environments/environment';
import { map, pipe } from 'rxjs';
import { Roles } from '../../shared/model/roles';
import { AssignedLocations } from '../../shared/model/assignedLocations';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.umisApiUrl;
  inventoryUrl = environment.imsApiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
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
        this.authService.setUser(user);
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

  getRoles(){
    return this.http.get<Roles[]>(this.baseUrl + 'account/roles');
  }

  getUserByAdmin(userId:string)
  {
    let httpParams  =  new HttpParams()
              .set('UserId', userId);
    return this.http.get<User[]>(this.baseUrl + 'account/getUserByAdmin', {params: httpParams } );
  }

  getAssignedLocations(createdById:string){
    let httpParams  =  new HttpParams()
              .set('createdById', createdById);
    return this.http.get<AssignedLocations[]>(this.inventoryUrl + 'userLocationAssignment/getAssignedLocations',{params: httpParams });
  }

  createAssignedLocations(vlaues: AssignedLocations) {
    console.log(vlaues);
    return this.http.post(this.inventoryUrl + 'userLocationAssignment/assignLocation', vlaues);
  }

  updateAssignedLocations(vlaues: AssignedLocations) {
    console.log(vlaues);
    return this.http.put(this.inventoryUrl + 'userLocationAssignment/updateassignLocation', vlaues);
  }

  deleteAssignedLocations(id: number) {
    return this.http.delete(this.inventoryUrl + 'userLocationAssignment/deleteassignLocation/' + id);
  }

}
