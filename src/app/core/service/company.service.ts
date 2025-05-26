import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from '../../shared/model/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  baseUrl = environment.imsApiUrl; 
  httpClient = inject(HttpClient);
  
  constructor() { }
  
  getCompany(userid:string){
    let httpParams  =  new HttpParams()
              .set('userid', userid);
              
    return this.httpClient.get<Company>(this.baseUrl + 'company',{params: httpParams });
  }

  addCompany(company:Company){
    company.id = 0; 
    company.locations = [];
    return this.httpClient.post<number>(this.baseUrl + 'company', company);
  }

  updateCompany(compnay:Company){
    return this.httpClient.put<Company>(this.baseUrl + 'company/' + compnay.id, compnay);
  }
}
