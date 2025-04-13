import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { product } from '../../shared/model/product';
import { Pagination } from '../../shared/model/pagination';
import { buyingRequestDto } from '../../shared/model/buyingRequestDto';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  httpClient = inject(HttpClient);
  baseUrl = "https://localhost:5001/api/";

  constructor() { }

  confirm(buyingItem:buyingRequestDto){
    return this.httpClient.post<any>(this.baseUrl + 'buying/confirm', buyingItem);
  }

  removeItem(id:number){
    return this.httpClient.delete(this.baseUrl + 'buying/' + id);
  }

  getAllByingWithPagination(pageindex:number,pagesize:number,){
      let httpParams  =  new HttpParams()
      .set('index', pageindex)
      .set('size', pagesize)
  
      return this.httpClient.get<Pagination<any>>(this.baseUrl + 'buying/search', {params: httpParams });
    }
}
