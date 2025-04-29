import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Location } from '../../shared/model/location';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/model/company';

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  baseUrl = environment.imsApiUrl; 
  httpClient = inject(HttpClient);
  
  private _location = new BehaviorSubject<Location[]>([]);
  location$ = this._location.asObservable();

  private _locationId = new BehaviorSubject<Number | null>(null);
  locationId$ = this._locationId.asObservable();

  constructor() { }


  getLocations(userid:string){
    let httpParams  =  new HttpParams()
              .set('userid', userid);
              
    return this.httpClient.get<Company>(this.baseUrl + 'company',{params: httpParams })
    // .pipe(
    //   map(res => {
    //     this.setLocation(res.locations[0].id);
    //     return res;

    //   }),
    // )
        .subscribe({
          next:res =>{
            console.log(res);
            this._location.next(res.locations);
            this.setLocation(res.locations[0].id);
          }
        })
  }

  setLocation(id: number ) {  
    this._locationId.next(id);
  }

}
