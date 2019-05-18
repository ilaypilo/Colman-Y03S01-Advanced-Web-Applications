import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MlService } from '../../services/ml.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { Observable } from 'rxjs';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';


declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-ml',
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.scss']
})
export class MlComponent implements OnInit {
  
  @ViewChild(AgmMap)
   map: AgmMap;

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
  isSearching: Boolean = false;
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
  geocoder:any;
  
  public location: Location = {
    lat: 31.0461,
    lng: 34.8516,
    marker: {
      lat: 31.0461,
      lng: 34.8516,
      draggable: true
    },
    zoom: 5,
    viewport: false
  };

  public markers: Marker[] = [];
  public currentMarker: Marker;
  
  constructor(
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private mlService: MlService,
    public mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper
  ) {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });


   }

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
  findLocation(address) {
    this.markers = []
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
          // skip the same element
          if (this.currentMarker &&
              results[0].geometry.location.lat() === this.currentMarker.lat &&
              results[0].geometry.location.lng() === this.currentMarker.lng ) {
              this.isSearching = false;
              return;
            }
          this.markers = []
          this.currentMarker = {
            lat :  results[0].geometry.location.lat(),
            lng : results[0].geometry.location.lng(),
            draggable: true
          }
          this.isSearching = false;
          this.markers.push(this.currentMarker);
          this.map.triggerResize(false);
        }
      } else {
        this.isSearching = false;
        alert("Sorry, this search produced no results.");
      }
    },
    )
  }
  
  cityChanged(city) {
    this.isSearching = true;
    this.findLocation(city);
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
      error => {
        this.toast.open(error.statusText, "danger");
        this.isSearching = false;
      },
      () => this.isLoading = false
    );
  }
  neighborhoodChanged(neighborhood) {
    this.street.setValue("");
    this.isSearching = true;
    this.mlService.getStreetsByNeighborhood(this.city.value, neighborhood).subscribe(
      data => {
        console.log(data)
        this.streets = data;
        this.street.setValue('');
        this.findLocation(this.city.value + ", " + neighborhood);
      },
      error => {
        this.toast.open(error.statusText, "danger");
        this.isSearching = false;
      },
      () => this.isLoading = false
    );

  }

  streetChanged(street) {
    this.neighborhood.setValue("");
    this.isSearching = true;
    this.mlService.getNeighborhood(this.city.value, street).subscribe(
      data => {
        this.neighborhood.setValue(data);
        this.findLocation(this.city.value + ", " + street);
      },
      error => {
        this.toast.open(error.statusText, "danger");
        this.isSearching = false;
      },
      () => this.isLoading = false
    );
  }

  optionsFilter(val: String, options: String[]) {
    if (null == val){
      return options;
    }
    return options.filter(option =>
      option.toString().toLowerCase().indexOf(val.toString().toLowerCase()) === 0);
  }

  predict() {
    this.isSearching = true;
    this.mlService.predict(this.predictForm.value).subscribe(
      data => {
        console.log(data);
        this.isSearching = false;
        this.prediction = data[0];
        this.toast.open('you successfully predict!', 'success');
      },
      error => this.toast.open(error, 'danger')
    );
  }
}
