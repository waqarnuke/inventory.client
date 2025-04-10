import { Component,HostListener, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BusyService } from '../../core/service/busy.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-sidenav',
  imports: [RouterOutlet,MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule,MatListModule,RouterModule,NgIf,MatProgressBarModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  busyService = inject(BusyService);
  showFiller = true;
  isMobile: boolean = window.innerWidth < 768;

  menuItems : any[] = [
    {route: 'dashboard', icon: 'dashboard', label:'Dashboard'},
    {
      route: null, 
      icon: 'shopping_bag', 
      label:'inventory',
      children: [
            {route: 'inventory/add-product', icon: 'shopping_cart ', label:'Add Product'},
            {route: 'inventory/product-list', icon: 'shopping_cart ', label:'Products'},
      ]
    }, 
    {
      route: null, 
      icon: 'shopping_bag', 
      label:'buy',
      children: [
            {route: 'buy/add-buy', icon: 'shopping_cart ', label:'Create Buying'},
            {route: 'buy/buy-list', icon: 'shopping_cart ', label:'Buying List'},
      ]
    }, 
    {route: 'selling', icon: 'shopping_bag' , label:'Selling'},
    {route: 'Employee', icon: 'people' , label:'Employee'},
    {route: 'Integrations', icon: 'extension' , label:'Integrations'},
    {route: 'reports', icon: 'bar_chart' , label:'Reports'},
    {route: 'Settings', icon: 'settings' , label:'Settings'}
  ];

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
  
}
