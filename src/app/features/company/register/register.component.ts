import { Component, inject } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { Register } from '../../../shared/model/register';
import { RegisterService } from '../../../core/service/register.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../../core/service/snackbar.service';
import { MainService } from '../../../core/service/main.service';
import { Location } from '../../../shared/model/location';
import { NgFor, NgIf,AsyncPipe } from '@angular/common';
import { AccountService } from '../../../core/service/account.service';

@Component({
  selector: 'app-register',
  imports: [MatTabsModule,ReactiveFormsModule,FormsModule,NgIf,NgFor],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private accountService = inject(AccountService); 
  private registerService = inject(RegisterService);
  private mainService = inject(MainService);
  private snackbar = inject(SnackbarService);

  buyRegisters : Register[];
  locationId: number = 0; 
  location : Location[] | undefined;
  
  seleRegister: Register[];

  buyRegisterForm: FormGroup = new FormGroup({}); 
  saleRegisterForm: FormGroup = new FormGroup({});
  
  userId: string = '';
  isEdit = false;
  isSeleEdit = false;



  constructor(
    private fb:FormBuilder,
  
  ) 
  { 
    this.buyRegisters = [];
    this.seleRegister = [];

    this.buyRegisterForm = this.fb.group({
          id:[0],
          cash : this.fb.control({value:'',disabled:false},[Validators.required]),
          locationId:this.fb.control({value:'',disabled:false},[Validators.required]),
          userId:['1']
          });
  
  this.saleRegisterForm = this.fb.group({
          id:[0],
          cash : this.fb.control({value:'',disabled:false},[Validators.required]),
          locationId:this.fb.control({value:'',disabled:false},[Validators.required]),
          userId:['1']
          });
    
  }

  ngOnInit(): void {
    this.userId = this.accountService.currentUser().id
    if(this.userId != null){
      this.mainService.getLocationForDropDown(this.userId);
      this.loadLocation();
      this.loadRigester(this.userId);
      this.loadSeleRegister(this.userId);
    }
  }

  loadLocation()
  {
    this.mainService.location$.subscribe({
      next: res =>this.location = res,
      error:err => console.log("location problem")
    })
  }

  loadRigester(id:string)
  {
    this.registerService.getBugingRegisterByUserId(id).subscribe({
      next: res => {
        this.buyRegisters = res;
      },
      error: err => console.log("could not load register")
    });
  }

  onEdit(id:number) {
    const register = this.buyRegisters.find(r => r.id === id);
    if (register) {
      this.buyRegisterForm.patchValue({
        id: register.id,
        cash: register.cash,
        locationId: register.locationId,
        userId: register.userId
      });
      this.isSeleEdit = true;
    }
  }

  onDelete(id:number) {
    this.registerService.deleteBugingRegister(id).subscribe({
      next: res => {
        this.snackbar.success('Register is deleted');
        this.loadRigester(this.userId);
      },
      error: err => {
        console.error(err);
        this.snackbar.error('Register is not deleted');
      }
    });
  }

  saveBuyingRegister(){
    if(this.buyRegisterForm.valid){
      let register = this.buyRegisterForm.value as Register;
      register.userId = this.userId;
      if(this.isEdit){
        register.id = this.buyRegisterForm.get('id')?.value;
        this.registerService.updateBugingRegister(register)
        .subscribe({
          next: res => {
            this.snackbar.success('Register is updated');
            this.loadRigester(this.userId);
            this.buyRegisterForm.reset();
            this.isEdit = false;
          },
          error: err => {
            console.error(err);
            this.snackbar.error('Register is not updated');
          }
        });
      }
      else{
        register.id = 0;
        this.registerService.addBugingRegister(register)
        .subscribe({
          next: res => {
            this.snackbar.success('Register is saved');
            this.loadRigester(this.userId);
            this.buyRegisterForm.reset();
          },
          error: err => {
            console.error(err);
            this.snackbar.error('Register is not saved');
          }
        });
      }
      
    }
    else {
      this.snackbar.error('Please fill all required fields');
    }
  }

  onNew() {
    this.buyRegisterForm.reset();
    this.isEdit = false;
    this.buyRegisterForm.patchValue({
      id: 0,
      userId: this.userId,
      locationId: 0
    }); 
  }
  loadSeleRegister(id:string) {
    this.registerService.getSelectedRegister(id).subscribe({
      next: res => {
        this.seleRegister =res;
      },
      error: err => {
        console.error(err);
        this.snackbar.error('Could not load selected register');
      }
    });
  }

  onSaleNew() {
    this.saleRegisterForm.reset();
    this.isEdit = false;
    this.saleRegisterForm.patchValue({
      id: 0,
      userId: this.userId,
      locationId: 0
    }); 
  }

  onSaleEdit(id:number) {
    const register = this.seleRegister.find(r => r.id === id);
    if (register) {
      this.saleRegisterForm.patchValue({
        id: register.id,
        cash: register.cash,
        locationId: register.locationId,
        userId: register.userId
      });
      this.isSeleEdit = true;
    }
  }

  onSaleDelete(id: number) {
  this.registerService.deleteSaleRegister(id).subscribe({
      next: res => {
        this.snackbar.success('Sale Register is deleted');
        this.loadSeleRegister(this.userId);
      },
      error: err => {
        console.error(err);
        this.snackbar.error('Sale Register is not deleted');
      }
    });
  }
  
  saveSaleRegister(){
    if(this.saleRegisterForm.valid){
      let register = this.saleRegisterForm.value as Register;
      register.userId = this.userId;
      console.log(register);
      if(this.isSeleEdit){
        register.id = this.saleRegisterForm.get('id')?.value;
        this.registerService.updateSelingRegister(register)
        .subscribe({
          next: res => {
            this.snackbar.success('Sale Register is updated');
            this.loadSeleRegister(this.userId);
            this.saleRegisterForm.reset();
            this.isSeleEdit = false;
          },
          error: err => {
            console.error(err);
            this.snackbar.error('Sale Register is not updated');
          }
        });
      }
      else{
        this.registerService.addSaleRegister(register)
        .subscribe({
          next: res => {
            this.snackbar.success('Sale Register is saved');
            this.loadSeleRegister(this.userId);
            this.onSaleNew()
          },
          error: err => {
            console.error(err);
            this.snackbar.error(err.error.message || 'Sale Register is not saved');
          }
        });
      }
      
    }
    else {
      this.snackbar.error('Please fill all required fields');
    }
  }
}
