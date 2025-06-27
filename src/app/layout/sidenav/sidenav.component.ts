import { Component,HostListener, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { BusyService } from '../../core/service/busy.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MainService } from '../../core/service/main.service';
import { AccountService } from '../../core/service/account.service';
import { DashboardService } from '../../core/service/dashboard.service';
import { Location } from '../../shared/model/location';
import { MENU_ITEMS } from './sidebar-menu';
import { AuthService } from '../../core/service/auth.service';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-sidenav',
  imports: [RouterOutlet,MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule,MatListModule,RouterModule,NgIf,MatProgressBarModule,
    MatSelectModule,MatFormFieldModule,NgFor,AsyncPipe,MatMenuModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
navigateTo(arg0: string) {
throw new Error('Method not implemented.');
}

  private authService = inject(AuthService);
  accoutService = inject(AccountService);
  mainService = inject(MainService);
  busyService = inject(BusyService);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  showFiller = true;
  isMobile: boolean = window.innerWidth < 768;
  role : string = "";

  menuItems : any[] = [];

  stores: any[] = [];
  selectedLocation : number = 0;
accountMenu: any;

  constructor() {
    console.log(this.accoutService.currentUser())
    if (this.accoutService.currentUser()) {
      this.role =  this.accoutService.currentUser().roles;
      const userId = this.accoutService.currentUser().id;  //this.accoutService.currentUser().roles === "Admin" ? this.accoutService.currentUser().id : this.accoutService.currentUser().id
      this.mainService.getLocationForDropDown(userId);
      //this.dashboardService.summary(1);
    }
  }
  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.menuItems = MENU_ITEMS.filter(item => item.roles?.includes(role));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleMenu(item: any) {
    item.expanded = !item.expanded;
  }

  onLocationChange(locationId: any) {
    const value = locationId.target.value;
    console.log(value);
    this.mainService.setLocation(value)
    this.dashboardService.summary(value);
  }

  logout() {
    this.accoutService.logout().subscribe({
      next: res => {
        this.accoutService.currentUser.set(null);
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  get visibleMenuItems() {
    const role = this.role;
    return this.menuItems.filter(item => item.roles === role || item.roles === 'All');
  }

}
