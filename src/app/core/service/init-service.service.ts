import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Location } from '../../shared/model/location';
import { environment } from '../../../environments/environment';

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


  getLocations(){
    return this.httpClient.get<Location[]>(this.baseUrl + 'location')
        .subscribe({
          next:res =>{
            this._location.next(res);
            this.setLocation(res[0].id);
          }
        })
  }

  setLocation(id: number ) {  
    this._locationId.next(id);
  }

}
