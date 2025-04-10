import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { inventoryService } from '../../core/service/inventory.service';
import { AddBuyComponent } from './add-buy/add-buy.component';
import { BuyListComponent } from './buy-list/buy-list.component';

export const bugRoutes: Routes = [
    { path: '', component: AddBuyComponent }, // ✅ Ye default component hoga
    { 
        path: 'add-buy', 
        component: AddBuyComponent,
        resolve :{
            brands  : () => inject(inventoryService).getBrands(),
            mobileNetwork  : () => inject(inventoryService).getMobileNetwork(),
            storage  : () => inject(inventoryService).getStorage(),
            model  : () => inject(inventoryService).getModel(),
            supplier  : () => inject(inventoryService).getSupplier(),
        },
    }, // ✅ Jab "/inventory/product" jayega to ProductComponent load hoga.
    { 
        path: 'add-buy:/id', 
        component: AddBuyComponent,
        resolve :{
            brands  : () => inject(inventoryService).getBrands(),
            mobileNetwork  : () => inject(inventoryService).getMobileNetwork(),
            storage  : () => inject(inventoryService).getStorage(),
            model  : () => inject(inventoryService).getModel(),
            supplier  : () => inject(inventoryService).getSupplier(),
        },
    },
    { 
        path: 'update-buy:/id', 
        component: AddBuyComponent,
        resolve :{
            brands  : () => inject(inventoryService).getBrands(),
            mobileNetwork  : () => inject(inventoryService).getMobileNetwork(),
            storage  : () => inject(inventoryService).getStorage(),
            model  : () => inject(inventoryService).getModel(),
            supplier  : () => inject(inventoryService).getSupplier(),
        },
    },
    { path: 'buy-list', component: BuyListComponent }
];