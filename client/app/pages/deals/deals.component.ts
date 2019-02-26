import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { DealService } from '../../services/deal.service';
import { Deal } from '../../shared/models/deal.model';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})

export class DealsComponent implements OnInit {

  title = 'עסקאות רשומות';
  deals: Deal[] = [];
  isLoading = true;
  displayedColumns = ['sale_date', 'city', 'street', 'address', 'asset_type', 'rooms', 'floor', 'year', 'square_meters', 'price'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dealForm: FormGroup;
  dealFilter = new FormControl('', [
    Validators.required,
    Validators.minLength(1)
  ]);
  searchButtonText = "חפש";
  searching = false;

  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private formBuilder: FormBuilder,
    private dealService: DealService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getDeals();
    this.dealForm = this.formBuilder.group({
      filter: this.dealFilter,
    });
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

  search() {
    this.searchButtonText = !this.searching ? "נקה חיפוש" : "חפש";

    if (this.searching) {
      this.dealFilter.reset();
      this.getDeals();
    } else {
      this.isLoading = true;

      this.dealService.queryDeals(this.dealForm.value.filter).subscribe(
        data => {
          console.log(data);
          this.deals = data;
          this.dataSource = new MatTableDataSource<Deal>(this.deals);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => console.log(error),
        () => this.isLoading = false
      );
    }
    this.searching = !this.searching;
  }
}