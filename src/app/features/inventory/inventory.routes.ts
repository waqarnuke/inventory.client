import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { inventoryService } from '../../core/service/inventory.service';

export const inventoryRoutes: Routes = [
    { path: '', component: AddProductComponent }, // ✅ Ye default component hoga
    { 
        path: 'add-product', 
        component: AddProductComponent,
        resolve :{
            brands  : () => inject(inventoryService).getBrands(),
            mobileNetwork  : () => inject(inventoryService).getMobileNetwork(),
            storage  : () => inject(inventoryService).getStorage(),
            model  : () => inject(inventoryService).getModel(),
            supplier  : () => inject(inventoryService).getSupplier(),
        },
    }, // ✅ Jab "/inventory/product" jayega to ProductComponent load hoga
    { path: 'product-list', component: ProductListComponent }
];