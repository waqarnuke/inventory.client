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

  buyingItem : buyingItem[] = [];
  quantity: number = 0;
  total: number = 0;
  
  buyingItemRequest: buyingRequestDto = {
    paymentMethod: "",
    Items: []
  }
  
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
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
    this.buyingService.confirm(this.buyingItemRequest).subscribe({
      next: (res) => {
        this.snackbar.success("Product added to cart successfully");
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
    this.buyingItem.forEach(id => {
      const index = this.buyingItem.findIndex(item => item.itemId === itemId);
      if (index !== -1) {
        this.buyingItem.splice(index, 1);
      }
    });
  }
}
