import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { product } from '../../shared/model/product';
import { Pagination } from '../../shared/model/pagination';
import { buyingRequestDto } from '../../shared/model/buyingRequestDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  httpClient = inject(HttpClient);
  baseUrl = environment.imsApiUrl;

  constructor() { }

  confirm(buyingItem:buyingRequestDto){
    return this.httpClient.post<any>(this.baseUrl + 'buying/confirm', buyingItem);
  }

  removeItem(id:number){
    return this.httpClient.delete(this.baseUrl + 'buying/' + id);
  }

  getAllByingWithPagination(locationId:number,pageindex:number,pagesize:number,){
      let httpParams  =  new HttpParams()
      .set('locationId', locationId)
      .set('index', pageindex)
      .set('size', pagesize)
  
      return this.httpClient.get<Pagination<any>>(this.baseUrl + 'buying/search', {params: httpParams });
    }
}
