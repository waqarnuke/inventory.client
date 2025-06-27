import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { DashboadSummaryDto } from '../../shared/model/dashboadSummaryDto';
import { AccountService } from '../../core/service/account.service';
import { User } from '../../shared/model/user';
import { MainService } from '../../core/service/main.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe,MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);
  public accountService = inject(AccountService);
  private mainService = inject(MainService);

  summary: DashboadSummaryDto = {} as DashboadSummaryDto;
  user: User = {} as User;
  locationId: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.mainService.locationId$.subscribe({
      next:res => {
        if(res !== null && res !== undefined && res !== 0) {
          this.dashboardService.summary(res as number);
          this.locationId = res as number;
        }
      }
    })
    this.user = this.accountService.currentUser();
    this.dashboardService.summary$.subscribe(
      res => {
        this.summary = res as DashboadSummaryDto;
      }
    )
  }

}
