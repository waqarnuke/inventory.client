import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BuySaleRequestDto } from '../../shared/model/buySaleRequestDto';
import { SaleTransactionDto } from '../../shared/model/saleTransactionDto';
import { Pagination } from '../../shared/model/pagination';

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

  getSaleByTransaction(locationId:number,pageindex:number,pagesize:number){
    let httpParams  =  new HttpParams()
          .set('locationId', locationId)
          .set('index', pageindex)
          .set('size', pagesize)
    return this.httpClient.get<Pagination<SaleTransactionDto>>(this.baseUrl + 'sale/get-sale-by-transaction',{params: httpParams });
  }
}
