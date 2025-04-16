import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {AsyncPipe, CommonModule, NgFor} from '@angular/common';
import {MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { inventoryService } from '../../../core/service/inventory.service';
import { buyingItem } from '../../../shared/model/buyingItem';
import { product } from '../../../shared/model/product';
import { BuySaleRequestDto } from '../../../shared/model/buySaleRequestDto';
import { BuySaleItem } from '../../../shared/model/buySaleItem';
import { SaleService } from '../../../core/service/sale.service';
import { CartProductComponent } from '../../../shared/components/product/cart-product/cart-product.component';

@Component({
  selector: 'app-add-sale',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    CartProductComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgFor
  ],
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.scss'
})
export class AddSaleComponent {
  private snackbar = inject(SnackbarService)
  inventoryService = inject(inventoryService)

  buySaleReq: BuySaleRequestDto = {
    paymentMethod: "",
    items: []
  }

  sellService = inject(SaleService)
  searchControl = new FormControl();
  filteredProducts: buyingItem[] = [];
  showDropdown = false;
  selectedProduct?: product;
  selectedProducts: buyingItem[] = [];

  quantity: number = 0;
  total: number = 0;
  includeTex: boolean = false;

  constructor() {}
  ngOnInit(): void {
    this.calculateTotal();
    this.calculateTotalQuantity();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.inventoryService.searchProduct(value || '')),
    ).subscribe(products => {
      this.filteredProducts = products;
    });
  }

  onInput() {
      this.showDropdown = true;
    }
  
    selectProduct(product: product) {
      this.selectedProduct = product;
      this.searchControl.setValue(product.title);
      this.showDropdown = false;
      console.log('Selected product:', product);
    }
    
    hideDropdown() {
      setTimeout(() => this.showDropdown = false, 200); // allow click to register before hiding
    }
  
    addToCart(product: BuySaleItem) {
      product.quantity = 1;
      this.selectedProducts.push(product);
      this.searchControl.setValue('');
      this.filteredProducts = [];
      this.quantity = this.selectedProducts.reduce((total, item) => total + item.quantity, 0);
      this.total = this.selectedProducts.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0);
    }
    
    decreaseQuantity(item: number) {
      console.log('Decrease quantity for item:', item);
      const index = this.selectedProducts.findIndex(i => i.itemId === item);
      if (index !== -1) {
        this.selectedProducts[index].quantity--;
        if (this.selectedProducts[index].quantity <= 0) {
          this.selectedProducts.splice(index, 1);
        }
        this.calculateTotalQuantity();
        this.calculateTotal();
      }
    }
    increaseQuantity(item: number) {
      const index = this.selectedProducts.findIndex(i => i.itemId === item);
      if (index !== -1) {
        this.selectedProducts[index].quantity++;
        this.calculateTotal();
        this.calculateTotalQuantity();
      }
    }
    calculateTotal() {
      this.total = this.selectedProducts.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);
      if (this.includeTex) {
        this.total += this.total * 0.15; // Assuming 15% tax
      }
    }
    calculateTotalQuantity() {
      this.quantity = this.selectedProducts.reduce((acc, item) => acc + item.quantity, 0);
    }
    
    removeItem(itemId: number) {
      this.selectedProducts.forEach(id => {
        const index = this.selectedProducts.findIndex(item => item.itemId === itemId);
        if (index !== -1) {
          this.selectedProducts.splice(index, 1);
        }
        this.calculateTotal();
        this.calculateTotalQuantity();
      });
    }
  
    purchase(paymentMethod:string) {
      this.buySaleReq.paymentMethod = paymentMethod;
      this.buySaleReq.items = this.selectedProducts;
      this.sellService.confirm(this.buySaleReq).subscribe({
        next: (res) => {
          this.snackbar.success("Sale has been successfully done");
          this.selectedProducts = [];
          this.quantity = 0;
          this.total = 0;
        },
        error: (err) => {
          this.snackbar.error(err?.error?.message);
        }
      })
    }
}
