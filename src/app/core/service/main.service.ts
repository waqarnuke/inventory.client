import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Location } from '../../shared/model/location';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/model/company';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  baseUrl = environment.imsApiUrl; 
  httpClient = inject(HttpClient);
  
  private _location = new BehaviorSubject<Location[]>([]);
  location$ = this._location.asObservable();

  private _locationId = new BehaviorSubject<Number | null>(null);
  locationId$ = this._locationId.asObservable();

  private _company = new BehaviorSubject<Company | null>(null);
  company$ = this._company.asObservable();

  currrentCompany = signal<any>(null);
  currentLocation = signal<any>(null);

  constructor() { }

  
  getLocations(userid:string){
    let httpParams  =  new HttpParams()
              .set('userid', userid);
              
    return this.httpClient.get<Company>(this.baseUrl + 'company',{params: httpParams })
      .subscribe({
        next:res =>{
          this.currrentCompany.set(res);
          this._company.next(res);
          //this._location.next(res.locations);
          this.setLocation(res.locations[0].id);
        }
      })
  }

  setLocation(id: number ) {  
    this._locationId.next(id);
  }

  getLocationForDropDown(userid:string){
    let httpParams  =  new HttpParams()
              .set('userId', userid);
    return this.httpClient.get<Location[]>(this.baseUrl + 'UserLocationAssignment/getLocations',{params: httpParams })
      .subscribe({
        next:res => {
          this._location.next(res)
        }
      });
  }
}
