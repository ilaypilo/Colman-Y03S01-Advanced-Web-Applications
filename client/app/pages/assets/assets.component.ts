import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../shared/models/asset.model';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})

export class AssetsComponent implements OnInit {

  title = 'Registered Assets';
  assets: Asset[] = [];
  isLoading = true;
  displayedColumns = ['city', 'neighborhood', 'street', 'price', 'rooms', 'floor', 'home_type' , 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
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
        this.dataSource = new MatTableDataSource<Asset>(this.assets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}