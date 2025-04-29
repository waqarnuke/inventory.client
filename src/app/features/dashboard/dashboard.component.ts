import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { DashboadSummaryDto } from '../../shared/model/dashboadSummaryDto';
import { AccountService } from '../../core/service/account.service';
import { User } from '../../shared/model/user';
import { InitServiceService } from '../../core/service/init-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);
  public accountService = inject(AccountService);
  private initService = inject(InitServiceService);

  summary: DashboadSummaryDto = {} as DashboadSummaryDto;
  user: User = {} as User;
  locationId: number = 0; 
  constructor() { }

  ngOnInit(): void {
    this.initService.locationId$.subscribe({
      next:res => {
        this.locationId = res as number;
        console.log(this.locationId )
      } 
    })
    this.user = this.accountService.currentUser();
    this.dashboardService.summary$.subscribe( 
      res => {
        this.summary = res as DashboadSummaryDto;
        console.log(res);
      }
    )
    //this.getSummary();
  }

  // getSummary() {
  //   this.dashboardService.summary(1).subscribe({
  //     next: res => {
  //       this.summary = res;
  //       console.log(this.summary);
  //     }
  //   })
  // }
}
