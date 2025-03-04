import { Routes } from '@angular/router';
import { InventoryComponent } from './features/inventory/inventory.component';
import { BuyProductComponent } from './features/buy-product/buy-product.component';
import { SellProductComponent } from './features/sell-product/sell-product.component';
import { ReportsComponent } from './features/reports/reports.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'',redirectTo: 'dashboard',pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    //{path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
    {path: 'inventory', component: InventoryComponent},
    {path: 'buying', component:BuyProductComponent},
    {path: 'selling', component:SellProductComponent},
    {path:'reports', component:ReportsComponent},  
];
