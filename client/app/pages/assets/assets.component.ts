import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../shared/models/asset.model';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { TableFilter } from '../../shared/table-filter/table-filter.component';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})

export class AssetsComponent implements OnInit {

  title = 'Registered Assets';
  assets: Asset[] = [];
  isLoading = true;
  displayedColumns = ['city', 'neighborhood', 'street', 'price', 'Rooms_text', 'Floor_text', 'HomeTypeID_text' , 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterValues = {
    city: '',
    neighborhood: '',
    street: '',
    price: '',
    Rooms_text: '',
    Floor_text: '',
    HomeTypeID_text: ''
  };
  cityFilter = new FormControl('');
  neighborhoodFilter = new FormControl('');
  streetFilter = new FormControl('');
  priceFilter = new FormControl('');
  roomsFilter = new FormControl('');
  floorFilter = new FormControl('');
  homeTypeFilter = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    public toast: ToastComponent,
    private assetService: AssetService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.getAssets();

    this.cityFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.city = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.neighborhoodFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.neighborhood = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.streetFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.street = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.priceFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.price = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.roomsFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.Rooms_text = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.floorFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.Floor_text = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.homeTypeFilter.valueChanges
      .subscribe(
        value => {
          this.filterValues.HomeTypeID_text = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  getAssets() {
    this.assetService.getAssets().subscribe(
      data => {
        this.assets = data;
        this.dataSource = new MatTableDataSource<Asset>(this.assets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
        this.route.queryParams.subscribe(params => { 
          if (params['city']) {
            this.cityFilter.setValue(params['city'])
            this.filterValues.city = params['city'];
            this.dataSource.filter = JSON.stringify(this.filterValues);
          }
          if (params['type']){
            this.homeTypeFilter.setValue(params['type'])
            this.filterValues.HomeTypeID_text = params['type'];
            this.dataSource.filter = JSON.stringify(this.filterValues);
          }
    
        });
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  showAsset(assetId: String){
    console.log('showing asset with id: ' + assetId);
    this.router.navigate(['/asset', assetId]);
  }
}