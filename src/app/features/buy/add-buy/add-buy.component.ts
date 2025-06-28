import { Component, inject, OnInit } from '@angular/core';
import { inventoryService } from '../../../core/service/inventory.service';
import { product } from '../../../shared/model/product';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponent } from '../../../shared/components/product/create-product/create-product.component';
import { CartProductComponent } from '../../../shared/components/product/cart-product/cart-product.component';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { BuyService } from '../../../core/service/buy.service';
import { buyingRequestDto } from '../../../shared/model/buyingRequestDto';
import { buyingItem } from '../../../shared/model/buyingItem';
import { MainService } from '../../../core/service/main.service';




@Component({
  standalone: true,
  selector: 'app-add-buy',
  imports: [
    CreateProductComponent,
    CartProductComponent
  ],
  templateUrl: './add-buy.component.html',
  styleUrl: './add-buy.component.scss'
})

export class AddBuyComponent implements OnInit {
  
  private snackbar = inject(SnackbarService)
  inventoryService = inject(inventoryService)
  buyingService = inject(BuyService)
  private mainService = inject(MainService);

  buyingItem : buyingItem[] = [];
  quantity: number = 0;
  total: number = 0;
  loationId: number = 0;

  buyingItemRequest: buyingRequestDto = {
    paymentMethod: "",
    locationId: this.loationId,
    Items: []
  }
  
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.mainService.locationId$.subscribe({
      next:res => this.loationId = Number(res)  || 0,
      error: err => console.error(err)
    })
  }
  
  getProducts(product:product)
  {
    this.inventoryService.addBuyingProduct(product).subscribe({
      next: (res) => {
        this.snackbar.success("Product added to cart successfully");
        this.buyingItem.push(res)
        this.quantity = this.buyingItem.reduce((total, item) => total + item.quantity, 0);
        this.total = this.buyingItem.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0);
      },
      error: (err) => {
        this.snackbar.error(err?.error?.message);
      }
    })
  }

  purchase(paymentMethod:string) {
    this.buyingItemRequest.paymentMethod = paymentMethod;
    this.buyingItemRequest.Items = this.buyingItem;
    this.buyingItemRequest.locationId = this.loationId;
    this.buyingService.confirm(this.buyingItemRequest).subscribe({
      next: (res) => {
        this.snackbar.success("Product purchase successfully");
        this.buyingItem = [];
        this.quantity = 0;
        this.total = 0;
      },
      error: (err) => {
        this.snackbar.error(err?.error?.message);
      }
    })
  }

  removeItem(itemId: number) {
    let confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete)
    {
      this.inventoryService.deleteProduct(itemId).subscribe({
        next: res => {
          this.snackbar.success ("product saved successfully" );
        }
      });
      
    }
    this.buyingItem.forEach(id => {
      const index = this.buyingItem.findIndex(item => item.itemId === itemId);
      if (index !== -1) {
        this.buyingItem.splice(index, 1);
      }
    });
  }
}
