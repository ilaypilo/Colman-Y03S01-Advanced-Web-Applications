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
  plot: File;

  constructor(
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private mlService: MlService
  ) { }

  ngOnInit() {
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
  
  cityChanged(city) {
    this.isSearching = true;
    
    this.mlService.getCityPlot(city).subscribe(
      data => {
        this.plot = data;
      },
      error => this.toast.open(error.statusText, "danger"),
      () => {
        this.isLoading = false
        this.isSearching = false
      }
    );
    this.mlService.getCityMse(city).subscribe(
      data => {
        this.mse = data;
      },
      error => this.toast.open(error.statusText, "danger"),
      () => {
        this.isLoading = false
      }
    );


  }

  optionsFilter(val: String, options: String[]) {
    if (null == val){
      return options;
    }
    return options.filter(option =>
      option.toString().toLowerCase().indexOf(val.toString().toLowerCase()) === 0);
  }
}
