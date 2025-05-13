import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { BuyService } from '../../../core/service/buy.service';
import { Pagination } from '../../../shared/model/pagination';
import { buyingItemDto } from '../../../shared/model/buyingItem';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { MainService } from '../../../core/service/main.service';



@Component({
  selector: 'app-buy-list',
  imports: [GenericTableComponent,NgIf,AsyncPipe],
  templateUrl: './buy-list.component.html',
  styleUrl: './buy-list.component.scss'
})
export class BuyListComponent {
  private snackbar = inject(SnackbarService)
  bindingService = inject(BuyService);
  private mainService = inject(MainService)
  locationId: number = 0; 
  private _buying = new BehaviorSubject<Pagination<buyingItemDto>>({
      data: [],
      totalCount: 0,
      pageIndex: 0,
      pageSize: 10
    });

    buying$ = this._buying.asObservable();  

    columns = [
      { key: 'itemId', label: 'Id', visible:false },
      { key: 'title', label: 'Title', visible:true },
      { key: 'quantity', label: 'Quantity', visible:true },
      { key: 'pricePerUnit', label: 'Price', visible:true },
      { key: 'totalPrice', label: 'Total', visible:true },
      { key: 'paymentMethod', label: 'Payment By', visible:true },
      { key: 'locationName', label: 'Location', visible:true }
    ]

    constructor() { 
      this.mainService.locationId$.subscribe({
        next:res => {
          this.locationId = res as number;
          this.load();
        } 
      })
      
    }
    

    load() {
      this.bindingService.getAllByingWithPagination(this.locationId,0,20).subscribe({
        next: (buying) => {
          this._buying.next(buying);
        }
      });
    }

    onPageChange(event: any) {
      this.bindingService.getAllByingWithPagination(this.locationId,event.pageIndex, event.pageSize).subscribe({
        next: (buying) => {
          this._buying.next(buying);
        }
      });
    }
}
