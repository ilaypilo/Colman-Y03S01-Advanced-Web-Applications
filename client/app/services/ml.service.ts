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

  getNeighborhood(city: String, street: String): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/get_neighborhood?city=${city}&street=${street}`);
  }

  getStreetsByNeighborhood(city: String, neighborhood: String): Observable<String[]> {
    return this.http.get<String[]>(`${this.api_url}/get_streets?city=${city}&neighborhood=${neighborhood}`);
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

  getCityPlot(city: String): Observable<File> {
    return this.http.get<File>(`${this.api_url}/get_plot/${city}`);
  }

  getCityMse(city: String): Observable<Number> {
    return this.http.get<Number>(`${this.api_url}/get_mse/${city}`);
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
