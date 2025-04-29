import { AfterViewInit, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { inventoryService } from '../../../core/service/inventory.service';
import { Brand } from '../../../shared/model/brand';
import { Subject, takeUntil } from 'rxjs';
import { NgFor, NgIf} from '@angular/common';
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
import { MainService } from '../../../core/service/main.service';

@Component({
  selector: 'app-add-product',
  imports: [NgFor,NgIf,ReactiveFormsModule,MatStepperModule,MatInputModule,MatTableModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit,AfterViewInit {

  activatedRoute = inject(ActivatedRoute);  
  private inventoryService = inject(inventoryService)
  private snackbar = inject(SnackbarService)
  private mainService = inject(MainService)
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  brands:Brand[];
  storage:Storage[];
  mobileNetwork :MobileNetwork[];
  model:Model[];
  images:image[] = [];
  supplier:Supplier[] = [];
  productDetailForm: FormGroup;
  imageStepForm: FormGroup;
  locationId: number = 0; 
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
    this.mainService.locationId$.subscribe({
      next:res => {
        this.locationId = res as number;
        console.log(this.locationId )
      } 
    })

    this.brands = [];
    this.storage = [];
    this.mobileNetwork =[];
    this.model =[]
    this.images = [];
    this.productDetailForm = this.fb.group({
      title : this.fb.control({value:'',disabled:false},[Validators.required]),
      description:['',[Validators.maxLength(100)] ],
      emi:this.fb.control({value:'',disabled:false},[Validators.required]),
      price:['',[Validators.required] ],
      stock:['',[Validators.required] ],
      color:this.fb.control({value:'',disabled:false},[Validators.required]),
      condition: this.fb.control({value:'',disabled:false},[Validators.required]),
      modelId: this.fb.control({value:'',disabled:false},[Validators.required]),
      brandId: this.fb.control({value:'',disabled:false},[Validators.required]),
      storageId:this.fb.control({value:'',disabled:false},[Validators.required]), 
      mobileNetworkId: this.fb.control({value:'',disabled:false},[Validators.required]), 
      itemTypeId: this.fb.control({value:[1],disabled:false},[Validators.required]),
      locationId:this.fb.control({value:this.locationId,disabled:false},[Validators.required]),
      userId:['1'],
      id:[0],
      images:[],
      supplierId: this.fb.control({value:'0',disabled:false})
    });

    this.imageStepForm = this.fb.group({}); 
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
        let itemTypeId = this.productDetailForm.get('itemTypeId');
        itemTypeId?.setValue(1);
        console.log(this.locationId)
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
            this.snackbar.error(err?.error?.message);
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
    
    const validFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {

      if (files[i].size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB!');
        return;
      }

      if (!validFileTypes.includes(files[i].type)) {
        alert('Invalid file type! Please upload PNG, JPG, or GIF.');
        return;
      }

      formData.append('images', files[i]); // images[] for backend
      console.log(files[i])
    }
  
    formData.append('itemId', this.newItemId.toString());

    this.inventoryService.uploadImages(formData).subscribe({
      next: (res) => {
        console.log(res)
        //this.images = res[0];
        this.snackbar.success("Images uploaded successfully")
        this.images[0] = res[0];
        console.log(this.images)
      }, 
      error: (err) => this.snackbar.error("Upload failed: " + err.message)
    });
  }

  New() {
    console.log("new")
    this.isEditMode = false;
    this.productDetailForm.reset();
    this.images = [];
    let itemTypeId = this.productDetailForm.get('itemTypeId');
    itemTypeId?.setValue(1);
    let locationId = this.productDetailForm.get('locationId');
    locationId?.setValue(this.locationId);
    let supplierId = this.productDetailForm.get('supplierId');
    supplierId?.setValue(0);
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

  deleteImage(id:number)
  {
    console.log(this.images)
    console.log(id);
    this.images = [];
    if(id) {
      this.inventoryService.deleteProductImage(id).subscribe({
        next: _ => {
          this.snackbar.success('Delete successful');
          this.images = [];
        }
      })
    } 
    console.log( this.images );
  }

  onFinish(){
    this.New()
  }

  
}
