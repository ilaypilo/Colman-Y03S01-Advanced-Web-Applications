import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../shared/models/asset.model';
import { ConfirmationDialogComponent } from '../../shared/confirm/confirmation-dialog';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})

export class AssetComponent implements OnInit {

  title = 'Registered Assets';
  assets: Asset[] = [];
  isLoading = true;
  displayedColumns = ['city', 'neighborhood', 'street', 'price', 'action'];
  dataSource: any;
  
  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private assetService: AssetService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAssets();
  }

  getAssets() {
    this.assetService.getAssets().subscribe(
      data => {
        this.assets = data;
        this.dataSource = new TableDataSource(this.assets);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class TableDataSource extends DataSource<any> {
  constructor(private data: any) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Asset[]> {
    return Observable.of(this.data);
  }

  disconnect() { }
}