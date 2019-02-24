import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Deal } from '../shared/models/deal.model';

@Injectable()
export class DealService {

  constructor(private http: HttpClient) { }

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>('/api/deals');
  }

  getDeal(id: String): Observable<Deal> {
    return this.http.get<Deal>(`/api/deal/${id}`);
  }

  queryDeals(search: String): Observable<Deal[]> {
    return this.http.get<Deal[]>(`/api/deals/query/${search}`);
  }
}
