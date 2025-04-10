import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { product } from '../../shared/model/product';
import { buyingRequestDto } from '../../shared/model/BuyingRequestDto';

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
}
