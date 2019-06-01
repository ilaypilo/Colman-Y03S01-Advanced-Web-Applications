import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MlService } from '../../services/ml.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';


@Component({
  selector: 'app-ml-performance',
  templateUrl: './ml-performance.component.html',
  styleUrls: ['./ml-performance.component.scss']
})
export class MlPerformanceComponent implements OnInit {

  title = 'ביצועים';
  isLoading = true;
  mlForm: FormGroup;
  city = new FormControl('', [
    Validators.required,
  ]);
  isSearching: Boolean = false;
  cities: String[] = [];
  filteredCities: Observable<String[]>;
  mse: Number;
  plotUrl: String;

  minWidth: number = 500;
  rowHeight: number = 40;
  colNumber: number;
  plotColNumber: number = 2;
  plotRowsNumber: number = 14;
  smallPlotColNumber: number = 0;
  smallPlotRowsNumber: number = 14;
  itemRowsNumber: number = 2;
  itemColsNumber: number = 2;
  priceRowsNumber: number = 2;
  priceColsNumber: number = 2;
  paddingColsNumber: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private mlService: MlService
  ) { }

  ngOnInit() {
    this.resizeElements();
    this.mlForm = this.formBuilder.group({
      city: this.city,
    });

    this.filteredCities = this.city.valueChanges
      .pipe(startWith(''),
        map(val => this.optionsFilter(val, this.cities)));

    this.mlService.getCities().subscribe(
      data => {
        this.cities = data;
        this.city.setValue('');
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );

  }

  cityChanged(event, city) {
    if (!event.source.selected) return;
    this.isSearching = true;
    this.plotUrl = `/api/ml/v1/get_plot/${city}`;
    console.log(this.plotUrl);
    this.mlService.getCityMse(city).subscribe(
      data => {
        this.mse = data;
        this.resizeElements();
      },
      error => this.toast.open(error.statusText, "danger"),
      () => {
        this.isLoading = false
        this.isSearching = false
      }
    );
  }

  optionsFilter(val: String, options: String[]) {
    if (null == val) {
      return options;
    }
    return options.filter(option =>
      option.toString().toLowerCase().indexOf(val.toString().toLowerCase()) === 0);
  }

  onResize(event) {
    this.resizeElements();
  }

  resizeElements() {
    this.plotRowsNumber = (window.innerHeight - 250) / this.rowHeight;
    this.plotColNumber = (window.innerWidth <= this.minWidth) ? 0 : 3;
    this.smallPlotRowsNumber = 10;
    this.smallPlotColNumber = (window.innerWidth <= this.minWidth && this.plotUrl) ? 2 : 0;
    this.colNumber = (window.innerWidth <= this.minWidth) ? 2 : 5;
    this.priceColsNumber = (window.innerWidth <= this.minWidth) ? 1 : 2;
    this.paddingColsNumber = (window.innerWidth <= this.minWidth) ? 0 : 1;
  }
}
