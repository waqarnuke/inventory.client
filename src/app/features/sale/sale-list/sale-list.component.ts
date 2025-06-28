import { Component, inject } from '@angular/core';
import { SaleService } from '../../../core/service/sale.service';
import { Pagination } from '../../../shared/model/pagination';
import { BehaviorSubject } from 'rxjs';
import { SaleTransactionDto } from '../../../shared/model/saleTransactionDto';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MainService } from '../../../core/service/main.service';

@Component({
  selector: 'app-sale-list',
  imports: [CurrencyPipe,NgFor,DatePipe,NgIf],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.scss'
})
export class SaleListComponent {

  sales: SaleTransactionDto[] = [];
  locationId: number = 0;

  saleService = inject(SaleService)
  mainService = inject(MainService);
  
  private _sale = new BehaviorSubject<Pagination<SaleTransactionDto>>({
        data: [],
        totalCount: 0,
        pageIndex: 0,
        pageSize: 10
      });
  
  sale$ = this._sale.asObservable(); 
  
  constructor() { 
    this.mainService.locationId$.subscribe({
      next:res => {
        this.locationId = res as number;
        //this.load();
      } 
    }) 
  }

  ngOnInit() {
    this.load();
  }
  load() {
    this.saleService.getSaleByTransaction(this.locationId,0,20).subscribe({
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
