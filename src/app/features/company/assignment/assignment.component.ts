import { Component,ElementRef,inject, OnInit, ViewChild} from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault,AsyncPipe, NgFor,CommonModule } from '@angular/common';
import { FormsModule,FormControl, ReactiveFormsModule} from '@angular/forms';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AccountService } from '../../../core/service/account.service';
import { User } from '../../../shared/model/user';
import { MainService } from '../../../core/service/main.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map, startWith } from 'rxjs';
import { Location } from '../../../shared/model/location';
import { AssignedLocations } from '../../../shared/model/assignedLocations';
import { SnackbarService } from '../../../core/service/snackbar.service';

@Component({
  selector: 'app-assignment',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, NgSwitch, NgSwitchDefault, NgSwitchCase, AsyncPipe,
    NgIf, MatTableModule, MatPaginatorModule, NgSwitch, NgSwitchDefault, NgSwitchCase, AsyncPipe, NgFor
],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent implements OnInit {

  private accountService = inject(AccountService); 
  private snackbar = inject(SnackbarService)
  mainService = inject(MainService);
  dataSource = new MatTableDataSource<any>();

  @ViewChild('input')
  input!: ElementRef<HTMLInputElement>;

  myControl = new FormControl('');
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  assignedLocation : AssignedLocations[]= [];

  selectedUsers: User[] = [];
  location : Location[] | undefined;

  selectedLoaciton :number = 0;
  isSave = false
  isddlSelect = false;


  columns = [
    { key: 'id', label: 'Id', visible:false },
    { key: 'userId', label: 'userId', visible:false },
    { key: 'email', label: 'email', visible:true },
    { key: 'firstName', label: 'firstName', visible:true },
    { key: 'lastName', label: 'lastName', visible:true },
    { key: 'locationId', label: 'locationId', visible:false },
    { key: 'dropdown', label: 'dropdown', visible:true },
    { key: 'actions', label: '', visible:true }
  ]
  ngOnInit(): void {
    const id = this.accountService.currentUser().id
    if(id)
    {
      this.loadAssignedLocations(id);
      this.loadUsers(id);
      this.loadLocation(id)  
      this.loadAutoComplate();
    }
  }

  loadUsers(id:string)
  {
    this.accountService.getUserByAdmin(id).subscribe({
      next:res =>{
        this.allUsers = res as User[];
        
      }
    })
  }

  loadLocation(id:string)
  {
    this.mainService.getLocationForDropDown(id);
      this.mainService.location$.subscribe({
        next: res => this.location = res,
        error:err => console.log("location problem")
    })
  }

  loadAutoComplate()
  {
    this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      map(value => this.filterUsers(value || ''))
    ).subscribe(filtered => {
      this.filteredUsers = filtered;
    });
  }

  loadAssignedLocations(id:string)
  {
    this.accountService.getAssignedLocations(id).subscribe({
      next: res => {
        this.assignedLocation = res;
        this.dataSource.data = this.assignedLocation;
      },
      error: err => console.log("error loading assigned location")
    })
  }
  
  get displayedColumns() {
    return this.columns.filter(c => c.visible).map(c => c.key);
  }

  filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.allUsers.filter(user =>
      (user.firstName + ' ' + user.lastName + ' ' + user.email).toLowerCase().includes(filterValue) &&
      !this.selectedUsers.some(u => u.id === user.id)
    );
  }

  selectUser(user: User) {
    this.dataSource.data.push(user);
    this.selectedUsers.push(user);
    this.myControl.setValue('');
    this.filteredUsers = this.filterUsers('');
  }

  removeUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.filteredUsers = this.filterUsers(this.myControl.value || '');
  }

  onLocationChange(locationId: any) {
    this.selectedLoaciton = locationId.target.value;
    this.isSave = true;
  }

  saveUser(user: User){
    console.log("selected lcoation" + this.selectedLoaciton )
    console.log( this.selectedUsers)
    this.accountService.createAssignedLocations({
      id: 0,
      userId: this.selectedUsers[0].id,
      email: this.selectedUsers[0].email,
      firstName: this.selectedUsers[0].firstName,
      lastName: this.selectedUsers[0].lastName,
      locationId: this.selectedLoaciton,
      createdById: this.accountService.currentUser().id,
      location: this.selectedLoaciton.toString(),
    })
    .subscribe({
      next: res => {
        const id = this.accountService.currentUser().id
        this.loadAssignedLocations(id);
        this.dataSource._updateChangeSubscription();
        this.snackbar.success("Location assigned successfully")
      },
      error: err => console.log("error loading assigned location")
    })
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.isSave = false;
  }

  onListLocationChange(locationId: any) {
    this.selectedLoaciton = locationId.target.value;
    this.isddlSelect = true;
    console.log("selected location" + this.selectedLoaciton)
  }

  onSave(row:any)
  {
    row.locationId = this.selectedLoaciton;
    console.log("ful lobje" + JSON.stringify(row))
    this.accountService.updateAssignedLocations(row)
    .subscribe({
      next: res => {
        const id = this.accountService.currentUser().id
        this.loadAssignedLocations(id);
        this.dataSource._updateChangeSubscription();
        this.snackbar.success("Location updated successfully")
      },
      error: err => console.log("error loading assigned location")
    })
  }

  onDelete(id:string)
  {
    this.accountService.deleteAssignedLocations(+id).subscribe({
      next:res => {
        this.snackbar.success('Delete successful');
        const id = this.accountService.currentUser().id
        this.loadAssignedLocations(id);
        this.dataSource._updateChangeSubscription();
      },
      error: err => {
        console.error('Error deleting location:', err);
        this.snackbar.error('Error deleting location:' + err.message);
      }
    })
  }
}
