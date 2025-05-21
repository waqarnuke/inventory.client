import {AfterViewInit, Component,inject, OnInit, ViewChild} from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault,AsyncPipe, NgFor } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Location } from '../../../shared/model/location';
import { AccountService } from '../../../core/service/account.service';
import { Company } from '../../../shared/model/company';
import { CompanyService } from '../../../core/service/company.service';
import { LocationService } from '../../../core/service/location.service';
import { SnackbarService } from '../../../core/service/snackbar.service';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-firm',
  imports: [ReactiveFormsModule, NgIf, MatTableModule, MatPaginatorModule, NgSwitch, NgSwitchDefault,NgSwitchCase, AsyncPipe, NgFor],
  templateUrl: './firm.component.html',
  styleUrl: './firm.component.scss'
})
export class FirmComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  public locationService = inject(LocationService);
  private accountService = inject(AccountService);  
  private companyService = inject(CompanyService);
  private snackbar = inject(SnackbarService)
  
  company = {} as Company; //Company;
  locations : Location[] = [];
  selectedLocation = {} as Location;
  dataSource = new MatTableDataSource<any>();

  companyForm: FormGroup = new FormGroup({}); 
  locationForm: FormGroup = new FormGroup({}); 
  isSubmitted = false;
  isEdit = false;
  
  //columns: any[] = [];
  columns = [
    { key: 'id', label: 'Id', visible:true },
    { key: 'name', label: 'Title', visible:true },
    { key: 'actions', label: 'Action', visible:true }
  ]


  constructor(private fb: FormBuilder) {

    this.companyForm = this.fb.group ({
      id: this.fb.control({value:'',disabled:false}),
      companyName: this.fb.control({value:'',disabled:false},[Validators.required]),
      userId: this.fb.control({value:'',disabled:false}),
    });

    this.locationForm = this.fb.group ({
      id: this.fb.control({value:'',disabled:false}),
      title: this.fb.control({value:'',disabled:false},[Validators.required]),

    });
  
  }

  get displayedColumns() {
    return this.columns.filter(c => c.visible).map(c => c.key);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadData(){
    this.companyService.getCompany(this.accountService.currentUser().id).subscribe({
      next:res=>{
        if(res)
        {
          this.dataSource.data = res.locations as Location[];
          this.company = res;
          let companyId = this.companyForm.get('id');
          companyId?.setValue(this.company.id);
          let userId = this.companyForm.get('userId');
          userId?.setValue(this.company.userId);
          let companyName = this.companyForm.get('companyName');
          companyName?.setValue(this.company.companyName);
          companyName?.disable();
          this.isSubmitted = true;
        }
        else{
          this.isSubmitted = false;
        }
        
        
      }
    })
  }

  onSubmit() {
    this.company.userId = this.accountService.currentUser().Id;
    this.companyService.updateCompany(this.companyForm.value)
      .subscribe({
        next:res=>{
          this.snackbar.success("Company name has been update.")
        },
        error:err => this.snackbar.error("Problem update problem.")
      
      })
    let itemTypeId = this.companyForm.get('companyName');
    itemTypeId?.disable();
    this.isSubmitted = true;
  } 

  edit(){
    let itemTypeId = this.companyForm.get('companyName');
    itemTypeId?.enable();
    this.isSubmitted = false;
  }

  onLocationSubmit(){
    let locationName = this.locationForm.get('title');
    this.selectedLocation.name = locationName?.value;
    console.log(this.selectedLocation.name);
    this.selectedLocation.createdById = this.accountService.currentUser().id;
    this.selectedLocation.firstName = this.accountService.currentUser().firstName;
    this.selectedLocation.lastName = this.accountService.currentUser().lastName;
    this.selectedLocation.email = this.accountService.currentUser().email;
    console.log(this.selectedLocation);
    if(this.isEdit){
      this.locationService.updateLocation(this.selectedLocation)
      .subscribe({
        next: res => {
          this.dataSource.data = this.dataSource.data.map(item => {
            if (item.id === this.selectedLocation.id) {
              return { ...item, locationName: this.selectedLocation.name };
            }
            return item;
          });
          this.dataSource._updateChangeSubscription();
        },
        error: err => {
          console.error('Error updating location:', err);
        }
      })
    }
    else{
      this.selectedLocation.companyId = this.company?.id as number;
      this.locationService.addLocations(this.selectedLocation)
      .subscribe({
        next: res => {
          this.dataSource.data = [...this.dataSource.data, res];
          this.loadData();
          this.dataSource._updateChangeSubscription();
        },
        error: err => {
          this.snackbar.error('Error adding location:' + err.message);
        }
      })
    }
    

    //
    locationName?.reset();
    this.isEdit = false;
    
  }

  onEdit(row: any) {
    let item = this.locationForm.get('title');
    this.selectedLocation = this.dataSource.data.filter(item => item.id === row)[0];
    this.selectedLocation.companyId = this.company?.id as number;
    item?.setValue(this.selectedLocation?.name);
    this.isEdit = true;

  }

  onDelete(row: any) {
    this.locationService.deleteLocation(row).subscribe({
      next:res => {
        this.snackbar.success('Delete successful');
        this.loadData();
      }
    })
  }
}

