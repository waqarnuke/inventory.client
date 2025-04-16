import { Routes } from '@angular/router';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { SaleListComponent } from './sale-list/sale-list.component';

export const saleProductRoutes: Routes = [
    { path: '', component: AddSaleComponent },
    { 
        path: 'add-sale', 
        component: AddSaleComponent,
    },
    { path: 'sale-list', component: SaleListComponent }
];