import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MlService } from '../../services/ml.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { Observable } from 'rxjs';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';


@Component({
  selector: 'app-ml',
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.scss']
})
export class MlComponent implements OnInit {

  title = 'חישוב מחיר לנכס';
  isLoading = true;
  predictForm: FormGroup;
  city = new FormControl('', [
    Validators.required,
  ]);
  neighborhood = new FormControl('', [
    Validators.required,
  ]);
  street = new FormControl('', [
    Validators.required,
  ]);
  build_year = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*')
  ]);
  property_type = new FormControl('', [
    Validators.required,
  ]);
  floor = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*')
  ]);
  building_mr = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*')
  ]);
  rooms_number = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*')
  ]);
  cities: String[] = [];
  filteredCities: Observable<String[]>;
  neighborhoods: String[] = [];
  filteredNeighborhoods: Observable<String[]>;
  streets: String[] = [];
  filteredStreets: Observable<String[]>;
  property_types: String[] = [];
  filteredPropertyTypes: Observable<String[]>;
  build_years: String[] = [];
  filteredBuildYears: Observable<String[]>;
  prediction: Number;

  constructor(
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private mlService: MlService
  ) { }

  ngOnInit() {
    this.predictForm = this.formBuilder.group({
      city: this.city,
      street: this.street,
      neighborhood: this.neighborhood,
      property_type: this.property_type,
      build_year: this.build_year,
      floor: this.floor,
      rooms_number: this.rooms_number,
      building_mr: this.building_mr
    });

    this.filteredCities = this.city.valueChanges
      .pipe(startWith(''),
         map(val => this.optionsFilter(val, this.cities)));

    this.filteredNeighborhoods = this.neighborhood.valueChanges
    .pipe(startWith(''),
      map(val => this.optionsFilter(val, this.neighborhoods)));

    this.filteredStreets = this.street.valueChanges
    .pipe(startWith(''),
        map(val => this.optionsFilter(val, this.streets)));

    this.filteredPropertyTypes = this.property_type.valueChanges
    .pipe(startWith(''),
        map(val => this.optionsFilter(val, this.property_types)));

    this.filteredBuildYears = this.build_year.valueChanges
    .pipe(startWith(''),
        map(val => this.optionsFilter(val, this.build_years)));

    this.mlService.getCities().subscribe(
      data => {
        this.cities = data;
        this.city.setValue('');
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );

    this.mlService.getPropertyTypes().subscribe(
      data => {
        this.property_types = data;
        this.property_type.setValue('');
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
    this.mlService.getBuildYears().subscribe(
      data => {
        this.build_years = data;
        this.build_year.setValue('');
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
  }
  cityChanged(city) {
    this.mlService.getNeighborhoods(city).subscribe(
      data => {
        this.neighborhoods = data;
        this.neighborhood.setValue('');
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
    this.mlService.getStreets(city).subscribe(
      data => {
        this.streets = data;
        this.street.setValue('');
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
  }
  neighborhoodChanged(city) {
    return;
  }

  optionsFilter(val: String, options: String[]) {
    if (null == val){
      return options;
    }
    return options.filter(option =>
      option.toString().toLowerCase().indexOf(val.toString().toLowerCase()) === 0);
  }

  predict() {
    this.mlService.predict(this.predictForm.value).subscribe(
      data => {
        console.log(data);
        this.prediction = data[0];
        this.toast.open('you successfully predict!', 'success');
      },
      error => this.toast.open(error, 'danger')
    );
  }
}
