import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboadSummaryDto } from '../../shared/model/dashboadSummaryDto';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Location } from '../../shared/model/location';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  baseUrl = environment.imsApiUrl;
  httpClient = inject(HttpClient);

  private _summary = new BehaviorSubject<DashboadSummaryDto | {}>({});
  //summary: DashboadSummaryDto = {} as DashboadSummaryDto;
  summary$ = this._summary.asObservable();

  constructor() { }

  summary(locationId: number) {
    let httpParams  =  new HttpParams()
        .set('locationId', locationId)
    return this.httpClient.get<DashboadSummaryDto>(this.baseUrl + 'dashboard/summary',  {params: httpParams }).subscribe({
      next: res => {
        this._summary.next(res);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
