import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Asset } from '../shared/models/asset.model';
import { DVC } from 'distinct-value-counter';
import { of } from 'rxjs';

@Injectable()
export class AssetService {

  constructor(private http: HttpClient) { }

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>('/api/assets');
  }

  getAsset(id: String): Observable<Asset> {
    return this.http.get<Asset>(`/api/asset/${id}`);
  }

  getAssetTypes(): Observable<JSON> {
    return this.http.get<JSON>('/api/assets/type');
  }

  getAssetCities(): Observable<JSON> {
    return this.http.get<JSON>('/api/assets/city');
  }

}
