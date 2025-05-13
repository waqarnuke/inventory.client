import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { FirmComponent } from './firm/firm.component';
import { EmployeeComponent } from './employee/employee.component';

export const companyRoutes: Routes = [
    { 
        path: '', component: CompanyComponent, 
        children:[
            { path: '', redirectTo: 'firm', pathMatch: 'full' },
            { path: 'firm', component: FirmComponent },
            { path: 'employee', component: EmployeeComponent }
        ]
    },
    
];