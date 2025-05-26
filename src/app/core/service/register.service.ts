import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Register } from '../../shared/model/register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  baseUrl = environment.imsApiUrl; 
  httpClient = inject(HttpClient);

  constructor() { }

  getBugingRegister(){
    return this.httpClient.get<Register[]>(this.baseUrl + 'buyregister');
  }

  getBugingRegisterByUserId(userid:string){
    let httpParams  =  new HttpParams()
                  .set('id', userid);
    return this.httpClient.get<Register[]>(this.baseUrl + 'buyregister/GetById',{params: httpParams });
  }
  
  addBugingRegister(register:Register){
    return this.httpClient.post<number>(this.baseUrl + 'buyregister',register);
  }
  
  updateBugingRegister(register:Register){
    return this.httpClient.put(this.baseUrl + 'buyregister/' + register.id ,register);
  }

  deleteBugingRegister(id:number){
    return this.httpClient.delete(this.baseUrl + 'buyregister/' + id);
  }

  getSelectedRegister(userId:string){
    let httpParams  =  new HttpParams()
                  .set('id', userId.toString());

    return this.httpClient.get<Register[]>(this.baseUrl + 'SaleRegister/GetById', {params:httpParams});
  }

  addSaleRegister(register:Register){
    return this.httpClient.post<number>(this.baseUrl + 'SaleRegister',register);
  }

  updateSelingRegister(register:Register){
    return this.httpClient.put(this.baseUrl + 'SaleRegister/' + register.id ,register);
  }
  deleteSaleRegister(id:number){
    return this.httpClient.delete(this.baseUrl + 'SaleRegister/' + id);
  }
}
