import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterOutlet,MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule,MatListModule,RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  showFiller = true;

  menuItems : any[] = [
    {route: 'dashboard', icon: 'dashboard', label:'Dashboard'},
    {route: 'inventory', icon: 'shopping_bag', label:'Inventory'}, 
    {route: 'buying', icon: 'shopping_cart ', label:'Buying'},
    {route: 'selling', icon: 'shopping_bag' , label:'Selling'},
    {route: 'Employee', icon: 'people' , label:'Employee'},
    {route: 'Integrations', icon: 'extension' , label:'Integrations'},
    {route: 'reports', icon: 'bar_chart' , label:'Reports'},
    {route: 'Settings', icon: 'settings' , label:'Settings'}
  ];
}
