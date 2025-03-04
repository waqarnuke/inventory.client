import { Component,HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterOutlet,MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule,MatListModule,RouterModule,NgIf],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  showFiller = true;
  isMobile: boolean = window.innerWidth < 768;

  menuItems : any[] = [
    {route: 'dashboard', icon: 'dashboard', label:'Dashboard'},
    {
      route: 'inventory', 
      icon: 'shopping_bag', 
      label:'Inventory',
      children: [
            { route: 'inventory/products', label: 'Products' },
            { route: 'inventory/stock', label: 'Stock' },
            { route: 'inventory/suppliers', label: 'Suppliers' }
      ]
    }, 
    {route: 'buying', icon: 'shopping_cart ', label:'Buying'},
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
