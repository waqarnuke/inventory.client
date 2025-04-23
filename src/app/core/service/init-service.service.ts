import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Location } from '../../shared/model/location';

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  baseUrl = "https://localhost:5001/api/";
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
            console.log(res)
            this._location.next(res);
            this.setLocation(res[0].id);
          }
        })
      // .pipe(
      //     tap((location) =>
      //     {
      //       console.log(location)
      //       this._location.next(location);
      //     })
      //   ); 
  }

  setLocation(id: number ) {  
    this._locationId.next(id);
  }

}
