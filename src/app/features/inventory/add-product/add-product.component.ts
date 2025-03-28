import { AfterViewInit, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { inventoryService } from '../../../core/service/inventory.service';
import { Brand } from '../../../shared/model/brand';
import { Subject, takeUntil } from 'rxjs';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MobileNetwork } from '../../../shared/model/mobileNetwork';
import { Model } from '../../../shared/model/model';
import { Storage } from '../../../shared/model/storage';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { image } from '../../../shared/model/image';
import { MatTableModule } from '@angular/material/table';
import { Supplier } from '../../../shared/model/supplier';

@Component({
  selector: 'app-add-product',
  imports: [NgFor,NgIf,ReactiveFormsModule,MatStepperModule,MatInputModule,NgSwitch,NgSwitchCase, NgSwitchDefault,MatTableModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit,AfterViewInit {

  activatedRoute = inject(ActivatedRoute);  
  private inventoryService = inject(inventoryService)
  private snackbar = inject(SnackbarService)

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  brands:Brand[];
  storage:Storage[];
  mobileNetwork :MobileNetwork[];
  model:Model[];
  images:image[] = [];
  supplier:Supplier[] = [];
  //private fb = inject(FormBuilder);
  productDetailForm: FormGroup;
  imageStepForm: FormGroup;

  // disabled feild 
  isEmiDisabled = false;
  isBrandDisabled = false;
  isStorageDisabled = false;
  isNetworkDisabled = false;
  
  isEditMode :boolean = false;
  newItemId: number | null = null;

  selectedFile: File | null = null;

  columns = [
    { key: 'id', label: 'Title', visible: true },
    { key: 'isMain', label: 'isMain', visible: true },
    { key: 'itemId', label: 'itemId', visible: true },
    { key: 'publicId', label: 'publicId', visible: true },
    { key: 'url', label: 'url', visible: true },
    { key: 'userId', label: 'userId', visible: true }  ];

  constructor(
    private _inventoryService:inventoryService,
    private fb:FormBuilder
  ) {
    this.brands = [];
    this.storage = [];
    this.mobileNetwork =[];
    this.model =[]
    this.images = [];
    this.productDetailForm = this.fb.group({
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
      itemTypeId: this.fb.control({value:[1],disabled:false},[Validators.required]),//['1'],
      locationId:['1'],
      userId:['1'],
      id:[0],
      images:[],
      supplierId: this.fb.control([''])
    });

    this.imageStepForm = this.fb.group({}); // initially empty
  }
  
  
  ngOnInit(): void { 
    this.activatedRoute.queryParams.subscribe(params => {
      let pid = params['id'];
      if(pid != undefined){
        this.isEditMode = true;
        this.newItemId = +pid; // ✅ Use this as itemId for images also
        console.log(this.newItemId)
        this.imageStepForm.addControl('unlocked', new FormControl('ok'));
        this.inventoryService.getProductById(pid).subscribe({
          next: (product) => {
            console.log(product);
            this.images = product.images;
            this.productDetailForm.patchValue(product);

            const selectedType = this.productDetailForm.controls['itemTypeId'].value.toString();
            
            console.log(selectedType);
            this.disableValidationFromEditMode(selectedType);
            //this.onEditProduct(product);
            //this.disableValidation();
          }
        })
      }
      else{
        let emiCtrl = this.productDetailForm.get('itemTypeId');
        emiCtrl?.setValue(1);
      }
    })

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
  ngAfterViewInit(): void{
  }

  saveProduct(stepper: MatStepper){
    console.log("submit")
    if (this.productDetailForm.invalid) {
      this.productDetailForm.markAllAsTouched(); // ✅ This will trigger validation errors
      return;
    }
    else
    {
      let data = JSON.stringify(this.productDetailForm.value)
      if(this.isEditMode && this.productDetailForm.controls['id'].value != 0){
        this.inventoryService.updateProduct(this.productDetailForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.snackbar.success("product update successfully");
            console.log(this.productDetailForm.value);
            
            //this.imageStepForm = this.fb.group({});
            //this.imageStepForm.addControl('unlocked', new FormControl('ok'));
            //stepper.next();
          },
          error: (err) => {
            console.log(err);
            this.snackbar.error(err.error.message);
        }});
      }
      else
      {
        this.inventoryService.addProduct(this.productDetailForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.newItemId = data.id;
            this.snackbar.success("product saved successfully");
            console.log(this.productDetailForm.value);
            this.imageStepForm = this.fb.group({});
            this.imageStepForm.addControl('unlocked', new FormControl('ok'));
            stepper.next();
          },
          error: (err) => {
            console.log(err);
            this.snackbar.error(err.error.message);
        }});
      }
      
      
    } 
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
      
    } else if (selectedType === '2') {
        this.findControlAndDisable("emi")
        this.findControlAndDisable("mobileNetworkId")
        this.findControlAndEnable("modelId")
      this.findControlAndEnable("brandId")
        this.findControlAndEnable("color")
      this.findControlAndEnable("condition")
      this.findControlAndEnable("storageId")
    } else if (selectedType === '3') {
      this.findControlAndDisable("emi")
      this.findControlAndDisable("modelId")
      this.findControlAndDisable("brandId")
      this.findControlAndDisable("mobileNetworkId")
      this.findControlAndDisable("color")
      this.findControlAndDisable("condition")
      this.findControlAndDisable("storageId")
    }
  }

  findControlAndDisable(controlName :string)
  {
    let emiCtrl = this.productDetailForm.get(controlName);
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

  disableValidationFromEditMode(selectedType :string){
    
    if (selectedType === '1') {
      this.findControlAndEnable("emi")
      this.findControlAndEnable("modelId")
      this.findControlAndEnable("brandId")
      this.findControlAndEnable("mobileNetworkId")
      this.findControlAndEnable("color")
      this.findControlAndEnable("condition")
      this.findControlAndEnable("storageId")
      
    } else if (selectedType === '2') {
        this.findControlAndDisable("emi")
        this.findControlAndDisable("mobileNetworkId")
        this.findControlAndEnable("modelId")
      this.findControlAndEnable("brandId")
        this.findControlAndEnable("color")
      this.findControlAndEnable("condition")
      this.findControlAndEnable("storageId")
    } else if (selectedType === '3') {
      this.findControlAndDisable("emi")
      this.findControlAndDisable("modelId")
      this.findControlAndDisable("brandId")
      this.findControlAndDisable("mobileNetworkId")
      this.findControlAndDisable("color")
      this.findControlAndDisable("condition")
      this.findControlAndDisable("storageId")
    }
  }

  onImageUpload(event: any) {
    const files: FileList = event.target.files;

    if (files.length === 0 || !this.newItemId) {
      this.snackbar.error("No files or item ID missing");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]); // images[] for backend
    }

    formData.append('itemId', this.newItemId.toString());

    this.inventoryService.uploadImages(formData).subscribe({
      next: () => this.snackbar.success("Images uploaded successfully"),
      error: (err) => this.snackbar.error("Upload failed: " + err.message)
    });
  }

  New() {
    console.log("new")
    this.isEditMode = false;
    this.productDetailForm.reset();
    let emiCtrl = this.productDetailForm.get('itemTypeId');
    emiCtrl?.setValue(1);
    this.disableValidation();
  }

  submitAll() {
    
  }

  getMainImage(item: any): string | null {
    const main = item.images?.find((img: any) => img.isMain);
    return main ? main.url : null;
  }

  get displayedColumns() {
    return this.columns.filter(c => c.visible).map(c => c.key);
  }

  deleteImage(id:number){

  }
}
