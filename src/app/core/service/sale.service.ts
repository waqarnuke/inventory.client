import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BuySaleRequestDto } from '../../shared/model/buySaleRequestDto';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  httpClient = inject(HttpClient);
  baseUrl = "https://localhost:5001/api/";

  constructor() { }

   confirm(saleItem:BuySaleRequestDto){
      return this.httpClient.post<any>(this.baseUrl + 'sale/confirm', saleItem);
    }
}
