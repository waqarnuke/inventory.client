import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { DashboadSummaryDto } from '../../shared/model/dashboadSummaryDto';
import { AccountService } from '../../core/service/account.service';
import { User } from '../../shared/model/user';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);
  public accountService = inject(AccountService);

  summary: DashboadSummaryDto = {} as DashboadSummaryDto;
  user: User = {} as User;

  constructor() { }

  ngOnInit(): void {
    this.user = this.accountService.currentUser();
    this.getSummary();
  }

  getSummary() {
    this.dashboardService.summary().subscribe({
      next: res => {
        this.summary = res;
        console.log(this.summary);
      }
    })
  }
}
