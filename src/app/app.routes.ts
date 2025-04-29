import { Routes } from '@angular/router';
import { InventoryComponent } from './features/inventory/inventory.component';
import { ReportsComponent } from './features/reports/reports.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { inject } from '@angular/core';
import { InitServiceService } from './core/service/init-service.service';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';

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
        path:'register',
        component:RegisterComponent
    },
    {
        path:'',
        component:LayoutComponent,
        children:[
            {
                path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]
            },
            {
                path: 'inventory',
                loadChildren: async () => {
                    const module = await import('./features/inventory/inventory.routes');
                    return module.inventoryRoutes;
                } 
            },
            {
                path: 'buy',
                loadChildren: async () => {
                    const module = await import('./features/buy/buy.routes');
                    return module.bugRoutes;
                } 
            },
            {
                path: 'sale',
                loadChildren: async () => {
                    const module = await import('./features/sale/saleProductRoutes');
                    return module.saleProductRoutes;
                } 
            },
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
