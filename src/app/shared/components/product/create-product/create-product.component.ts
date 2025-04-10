import { AfterViewInit, Component, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { InventoryComponent } from '../../../../features/inventory/inventory.component';
import { Brand } from '../../../model/brand';
import { MobileNetwork } from '../../../model/mobileNetwork';
import { Model } from '../../../model/model';
import { image } from '../../../model/image';
import { Supplier } from '../../../model/supplier';
import { Storage } from '../../../model/storage';
import { inventoryService } from '../../../../core/service/inventory.service';
import { product } from '../../../model/product';

@Component({
  selector: 'app-create-product',
  imports: [NgFor,NgIf,ReactiveFormsModule,MatInputModule,NgSwitch,NgSwitchCase, NgSwitchDefault],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {

  @Output() products = new EventEmitter<product>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _inventoryService = inject(inventoryService);
  productDetailForm: FormGroup = new FormGroup({}); 

  brands:Brand[] = [];
  storage:Storage[] = [];
  mobileNetwork :MobileNetwork[] = [];
  model:Model[] = [];
  images:image[] = [];
  supplier:Supplier[] = [];

  constructor(private fb:FormBuilder) {
    this.productDetailForm = this.fb.group
    ({
      title : this.fb.control({value:'',disabled:false},[Validators.required]), //['',[Validators.required] ],
      description:['',[Validators.maxLength(100)] ],
      emi:this.fb.control({value:'',disabled:false},[Validators.required]), //['',[Validators.required, Validators.maxLength(25)] ],
      price:['',[Validators.required] ],
      stock:['',[Validators.required] ],
      color:this.fb.control({value:'',disabled:false},[Validators.required]),//['',[Validators.required] ],
      condition: this.fb.control({value:'',disabled:false},[Validators.required]),//['',[Validators.required] ],
      modelId: this.fb.control({value:'',disabled:false},[Validators.required]),//['',[Validators.required] ],
      brandId: this.fb.control({value:'',disabled:false},[Validators.required]),//['',[Validators.required] ],
      storageId:this.fb.control({value:'',disabled:false},[Validators.required]), //['',[Validators.required] ],
      mobileNetworkId: this.fb.control({value:'',disabled:false},[Validators.required]), //['',[Validators.required] ],
      itemTypeId: this.fb.control({value:1,disabled:false},[Validators.required]),//['1'],
      locationId:[1],
      userId:['1'],
      id:[0],
      images:[],
      supplierId: this.fb.control({value:'0',disabled:false})
    });
  }
  ngOnInit(): void {

    this.disableValidation();
    //Get brands
    this._inventoryService.brands$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next:res => {
              this.brands = res
            } //
          })

    //Get Models
    this._inventoryService.model$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next:res => {
              this.model = res
            } //
          })

    //Get storage
    this._inventoryService.storage$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next:res => {
              this.storage = res
            } //
          })

    //Get mobile network
    this._inventoryService.mobileNetwork$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next:res => {
              this.mobileNetwork = res
            } //
          })

    //Get mobile network
    this._inventoryService.supplier$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next:res => {
              this.supplier = res
            } //
          })
  }

  formEntity()
  {
    
  }

  disableValidation(){
    const selectedType = this.productDetailForm.controls['itemTypeId'].value.toString();
    
    if (selectedType === '1') {
      this.findControlAndEnable("emi")
      this.findControlAndEnable("modelId")
      this.findControlAndEnable("brandId")
      this.findControlAndEnable("mobileNetworkId")
      this.findControlAndEnable("color")
      this.findControlAndEnable("condition")
      this.findControlAndEnable("storageId")
      this.findControlAndDisable("stock")
      
    } else if (selectedType === '2') {
        this.findControlAndDisable("emi")
        this.findControlAndDisable("mobileNetworkId")
        this.findControlAndEnable("modelId")
      this.findControlAndEnable("brandId")
        this.findControlAndEnable("color")
      this.findControlAndEnable("condition")
      this.findControlAndEnable("storageId")
      this.findControlAndEnable("stock")
    } else if (selectedType === '3') {
      this.findControlAndDisable("emi")
      this.findControlAndDisable("modelId")
      this.findControlAndDisable("brandId")
      this.findControlAndDisable("mobileNetworkId")
      this.findControlAndDisable("color")
      this.findControlAndDisable("condition")
      this.findControlAndDisable("storageId")
      this.findControlAndEnable("stock")
    }
  }

  findControlAndDisable(controlName :string)
  {
    let emiCtrl = this.productDetailForm.get(controlName);
    if(controlName == "stock")
    {
      emiCtrl?.setValue("1");
    }
    
    emiCtrl?.setValue("0");
    emiCtrl?.clearValidators();
    emiCtrl?.updateValueAndValidity();
    emiCtrl?.disable();
  }

  findControlAndEnable(controlName :string)
  {
    let emiCtrl = this.productDetailForm.get(controlName);
    emiCtrl?.addValidators(Validators.required);
    emiCtrl?.updateValueAndValidity();
    emiCtrl?.enable();
  }

  saveProduct()
  {
    if (this.productDetailForm.invalid) {
      this.productDetailForm.markAllAsTouched(); // ✅ This will trigger validation errors
      return;
    }
    let data = JSON.stringify(this.productDetailForm.value)
    this.products.emit(this.productDetailForm.value)
    this.productDetailForm.reset();
    let itemTypeId = this.productDetailForm.get('itemTypeId');
    itemTypeId?.setValue(1);
    let locationId = this.productDetailForm.get('locationId');
    locationId?.setValue(1);
    let supplierId = this.productDetailForm.get('supplierId');
    supplierId?.setValue(1);
    this.disableValidation();
  }


}
