import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboadSummaryDto } from '../../shared/model/dashboadSummaryDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  baseUrl = environment.imsApiUrl;
  httpClient = inject(HttpClient);
  
  constructor() { }

  summary(){
    return this.httpClient.get<DashboadSummaryDto>(this.baseUrl + 'dashboard/summary');
  }
}
