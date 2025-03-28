import { Routes } from '@angular/router';
import { InventoryComponent } from './features/inventory/inventory.component';
import { BuyProductComponent } from './features/buy-product/buy-product.component';
import { SellProductComponent } from './features/sell-product/sell-product.component';
import { ReportsComponent } from './features/reports/reports.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

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
            {
                path: 'inventory',
                loadChildren: async () => {
                    const module = await import('./features/inventory/inventory.routes');
                    return module.inventoryRoutes;
                } 
            },
            
            {path: 'selling', component:SellProductComponent},
            {path:'reports', component:ReportsComponent}, 
        ]
    },
    {
        path:'server-error',
        component:ServerErrorComponent
    },
    {
        path:'not-found',
        component:NotFoundComponent
    }
];
