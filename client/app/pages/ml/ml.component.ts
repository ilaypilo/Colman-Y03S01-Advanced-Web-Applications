import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MlService } from '../../services/ml.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ml',
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.scss']
})
export class MlComponent implements OnInit {

  title = 'ML';
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
  rooms = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*')
  ]);
  cities: String[];
  // filteredCities: Observable<string[]>;
  neighborhoods: String[];
  streets: String[];
  property_types: String[];
  build_years: String[];
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
      rooms: this.rooms,
      building_mr: this.building_mr
    });

    this.mlService.getCities().subscribe(
      data => {
        this.cities = data;
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );

    this.mlService.getPropertyTypes().subscribe(
      data => {
        this.property_types = data;
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
    this.mlService.getBuildYears().subscribe(
      data => {
        this.build_years = data;
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
  }
  cityChanged(city) {
    this.mlService.getNeighborhoods(city).subscribe(
      data => {
        this.neighborhoods = data;
        console.log(this.neighborhoods);
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
    this.mlService.getStreets(city).subscribe(
      data => {
        this.streets = data;
        console.log(this.streets);
      },
      error => this.toast.open(error.statusText, "danger"),
      () => this.isLoading = false
    );
  }
  neighborhoodChanged(city) {
    return;
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
