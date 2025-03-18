import { Routes } from '@angular/router';
import { InventoryComponent } from './features/inventory/inventory.component';
import { BuyProductComponent } from './features/buy-product/buy-product.component';
import { SellProductComponent } from './features/sell-product/sell-product.component';
import { ReportsComponent } from './features/reports/reports.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',
        component:LayoutComponent,
        children:[
            {path: 'dashboard', component: DashboardComponent},
            //{path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
            {
                path: '',  
                children:[
                    {path: 'inventory/product', loadComponent : () => import('./features/inventory/product/product.component').then(m =>m.ProductComponent)},
                ]
            },
            
            {path: 'selling', component:SellProductComponent},
            {path:'reports', component:ReportsComponent}, 
        ]
    },
];
