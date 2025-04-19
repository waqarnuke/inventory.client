import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaleService } from '../../../core/service/sale.service';
import { Pagination } from '../../../shared/model/pagination';
import { BehaviorSubject } from 'rxjs';
import { SaleTransactionDto } from '../../../shared/model/saleTransactionDto';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sale-list',
  imports: [CurrencyPipe,NgFor,DatePipe,NgIf],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.scss'
})
export class SaleListComponent {
  sales: SaleTransactionDto[] = [];
  saleService = inject(SaleService)
  private _sale = new BehaviorSubject<Pagination<SaleTransactionDto>>({
        data: [],
        totalCount: 0,
        pageIndex: 0,
        pageSize: 10
      });
  
      sale$ = this._sale.asObservable(); 
  constructor() { }

  ngOnInit(): void {
    this.load();
   
  }

  load() {
    this.saleService.getSaleByTransaction(0,20).subscribe({
      next: (sale) => {
        this.sales = sale.data.map(s => ({ ...s, showDetails: false }));
        this._sale.next(sale);
      }
    });
  }
  toggleDetails(sale: any) {
    sale.showDetails = !sale.showDetails;
  }
}
