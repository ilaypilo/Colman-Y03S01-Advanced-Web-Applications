import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Asset } from '../shared/models/asset.model';

@Injectable()
export class AssetService {

  constructor(private http: HttpClient) { }

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>('/api/assets');
  }

  countAssets(): Observable<number> {
    return this.http.get<number>('/api/assets/count');
  }

  getAsset(id: String): Observable<Asset> {
    return this.http.get<Asset>(`/api/asset/${id}`);
  }

}
