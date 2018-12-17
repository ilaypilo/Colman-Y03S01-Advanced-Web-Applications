import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../shared/models/asset.model';
import { ConfirmationDialogComponent } from '../../shared/confirm/confirmation-dialog';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})

export class AssetComponent implements OnInit {

  title = 'Registered Asset';
  asset: Asset;
  isLoading = true;
  displayedColumns = ['city', 'neighborhood', 'street', 'price', 'rooms', 'floor', 'home_type' , 'action'];
  dataSource: any;
  id: string;
  private sub: any;

  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private assetService: AssetService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
        this.id = params['id']; // (+) converts string 'id' to a number
        this.getAsset(this.id);
       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAsset(id) {
    this.assetService.getAsset(id).subscribe(
      data => {
        this.asset = data;
        this.dataSource = new TableDataSource(this.asset);
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