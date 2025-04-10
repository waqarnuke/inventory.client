import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {AsyncPipe, CommonModule, NgFor} from '@angular/common';
import {MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { inventoryService } from '../../core/service/inventory.service';
import { product } from '../../shared/model/product';


@Component({
  selector: 'app-sell-product',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgFor
  ],
  templateUrl: './sell-product.component.html',
  styleUrl: './sell-product.component.scss'
})
export class SellProductComponent implements OnInit  {
  inventoryService = inject(inventoryService)
  searchControl = new FormControl();
  filteredProducts: product[] = [];
  showDropdown = false;
  selectedProduct?: product;
  selectedProducts: product[] = [];
  showAddProduct = false;

  constructor() {}


  ngOnInit(): void {
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

  addToCart(product: product) {
    this.selectedProducts.push(product);
    this.searchControl.setValue('');
    this.filteredProducts = [];
    this
  }
  
  onProductAdded(product: any) {
    this.showAddProduct = false;
    if (product) {
      this.filteredProducts.push(product);
      this.searchControl.setValue(product.name);
      this.selectProduct(product);
    }
  }
}
