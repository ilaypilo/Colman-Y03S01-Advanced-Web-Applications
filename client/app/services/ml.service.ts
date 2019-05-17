import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MlService {

  constructor(private http: HttpClient) { }
  api_url = "/api/ml/v1";
  getCities(): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/cities`);
  }

  getNeighborhoods(city: String): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/neighborhoods/${city}`);
  }

  getStreets(city: String): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/streets/${city}`);
  }

  getPropertyTypes(): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/property_types`);
  }

  getBuildYears(): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/build_years`);
  }

  predict(asset: any): Observable<Number[]> {
    var o = {
      "city" : asset["city"],
      "data" : [asset]
    }
    console.log(o);
    return this.http.post<Number[]>(`${this.api_url}/predict`, o);
  }
}