import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { inventoryService } from '../../../core/service/inventory.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from '../../../shared/model/pagination';
import { product } from '../../../shared/model/product';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { MainService } from '../../../core/service/main.service';

@Component({
  selector: 'app-product-list',
  imports: [NgIf,RouterLink,GenericTableComponent, AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent{

  private snackbar = inject(SnackbarService)
  private router = inject(Router);
  invtoryService = inject(inventoryService);
  mainService = inject(MainService);

  private _products = new BehaviorSubject<Pagination<product>>({
    data: [],
    totalCount: 0,
    pageIndex: 0,
    pageSize: 10
  });

  products$ = this._products.asObservable();

  locationId: number = 0;

  columns = [
    { key: 'id', label: 'id', visible:false },
    { key: 'title', label: 'Title', visible:true },
    { key: 'description', label: 'Description', visible:true },
    { key: 'price', label: 'Price', visible:true },
    { key: 'stock', label: 'Quantity', visible:true },
    { key: 'actions', label: '', visible:true }
  ]
  /**
   *
   */
  constructor() {
    this.mainService.locationId$.subscribe({
      next:res => {
        this.locationId = res as number;
        this.loadProducts();
      } 
    }) 
    
  }

  loadProducts() {
    this.invtoryService.getproducts(this.locationId,0,20,'Id',false).subscribe({
      next: (products) => {
        this._products.next(products);
      }
    });
  }
  
  onEditProduct(pid: any) {
    this.router.navigate(['/inventory/add-product'], { queryParams: { id: pid } });
  }
  
  onDeleteProduct(productid: any) {
    let confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete)
    {
      this.invtoryService.deleteProduct(productid).subscribe({
        next: res => {
          this.loadProducts();
        }
      });
      this.snackbar.success ("product saved successfully" );
    }
  }

  onPageChange(event: any) {
    this.invtoryService.getproducts(this.locationId,event.pageIndex, event.pageSize,'Id',false).subscribe({
      next: (products) => {
        this._products.next(products);
      }
    });
  }
}
