import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { DealService } from '../../services/deal.service';
import { Deal } from '../../shared/models/deal.model';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})

export class DealsComponent implements OnInit {

  title = 'Registered Deals';
  deals: Deal[] = [];
  isLoading = true;
  displayedColumns = ['sale_date', 'city', 'street', 'address', 'asset_type', 'rooms', 'floor', 'year', 'square_meters' ,'price'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private dealService: DealService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getDeals();
  }

  getDeals() {
    this.dealService.getDeals().subscribe(
      data => {
        this.deals = data;
        this.dataSource = new MatTableDataSource<Deal>(this.deals);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
  }
}