import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { inventoryService } from '../../../core/service/inventory.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from '../../../shared/model/pagination';
import { product } from '../../../shared/model/product';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { InitServiceService } from '../../../core/service/init-service.service';

@Component({
  selector: 'app-product-list',
  imports: [NgIf,RouterLink,GenericTableComponent, AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  private snackbar = inject(SnackbarService)
  private router = inject(Router);
  invtoryService = inject(inventoryService);
  initService = inject(InitServiceService);

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
    this.initService.locationId$.subscribe({
      next:res => {
        this.locationId = res as number;
        console.log(this.locationId )
      } 
    }) 
    
  }
  ngOnInit(): void {
    this.loadProducts();    
  }

  loadProducts() {
    console.log(this.locationId)
    this.invtoryService.getproducts(this.locationId,0,20).subscribe({
      next: (products) => {
        this._products.next(products);
      }
    });
  }
  
  onEditProduct(pid: any) {
    console.log('Edit:', pid);
    this.router.navigate(['/inventory/add-product'], { queryParams: { id: pid } });
    // Open edit dialog / navigate to form
  }
  
  onDeleteProduct(productid: any) {
    console.log(productid)
    let confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete)
    {
      this.invtoryService.deleteProduct(productid).subscribe({
        next: res => {
          this.loadProducts();
          //this._products.next(products);
        }
      });
      this.snackbar.success ("product saved successfully" );
    }
    console.log('Delete:', productid);
    // Confirm and call delete service
  }

  onPageChange(event: any) {
    this.invtoryService.getproducts(this.locationId,event.pageIndex, event.pageSize).subscribe({
      next: (products) => {
        this._products.next(products);
      }
    });
  }
}
