import {CurrencyPipe, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { product } from '../../../model/product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { buyingItem } from '../../../model/buyingItem';
import { BuySaleItem } from '../../../model/buySaleItem';

@Component({
  selector: 'app-cart-product',
  imports: [NgFor,CurrencyPipe,ReactiveFormsModule],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.scss'
})
export class CartProductComponent implements OnInit {
  
  @Output() purchase = new EventEmitter<any>();
  @Output() removeEmit = new EventEmitter<number>();
  @Output() decreaseQuantityEmit = new EventEmitter<number>();
  @Output() increaseQuantityEmit = new EventEmitter<number>();

  @Input() items: BuySaleItem[] = [];
  @Input() quantity: number = 0;
  @Input() total: number = 0;
  @Input() includeTex: boolean = false;
  @Input() isAactive: boolean = false;
  @Input() maxQuantity: number = 0;
  
  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  buyForm: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) {
    this.buyForm = this.fb.group({
      method: this.fb.control({value:1,disabled:false},[Validators.required])
    });
    
  }

  ngOnInit(): void {
    let method = this.buyForm.get('method');
    method?.setValue("Cash");
  }

  onPurchase() {
    this.purchase.emit(this.buyForm.get('method')?.value);
  }
  
  removeItem(item: number) {
    this.removeEmit.emit(item);
  }

  decreaseQuantity(item: number) {
    this.decreaseQuantityEmit.emit(item);
  }

  increaseQuantity(item: number) {
    this.increaseQuantityEmit.emit(item);   
  }
  
}
