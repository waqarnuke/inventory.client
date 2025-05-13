import { inject, Injectable } from '@angular/core';
import { Location } from '../../shared/model/location';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  httpClient = inject(HttpClient) 
    baseUrl = environment.imsApiUrl;

  constructor() { }

  addLocations(location:Location){

    return this.httpClient.post<Location>(this.baseUrl + 'location/', location);
  }

  updateLocation(location:Location){
    return this.httpClient.put<Location>(this.baseUrl + 'location/' + location.id, location);
  }

  deleteLocation(id:number){
    return this.httpClient.delete(this.baseUrl + 'location/' + id);
  }
}
