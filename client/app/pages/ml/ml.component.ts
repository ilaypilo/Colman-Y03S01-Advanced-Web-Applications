import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MlService } from '../../services/ml.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
  address_level_1?: string;
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
    Validators.pattern('[0-9]*'),
    Validators.min(1900),
    Validators.max(2050)
  ]);
  property_type = new FormControl('', [
    Validators.required,
  ]);
  floor = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.min(0),
    Validators.max(20)
  ]);
  building_mr = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.min(30)
  ]);
  rooms_number = new FormControl('', [
    Validators.required,
    Validators.pattern('([0-9]*[.])?[0-9]+'),
    Validators.min(1),
    Validators.max(7)
  ]);
  isSearching: boolean = false;
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
  geocoder: any;

  minWidth: number = 500;
  rowHeight: number = 40;
  colNumber: number;
  mapColNumber: number = 2;
  mapRowsNumber: number = 14;
  itemRowsNumber: number = 2;
  itemColsNumber: number = 1;
  priceRowsNumber: number = 2;
  priceColsNumber: number = 2;
  paddingColsNumber: number = 1;
  buttonWidth: number;
  infoRowNumber = 1;

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
    this.resizeElements();
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

  onResize(event) {
    this.resizeElements();
  }

  resizeElements() {
    this.mapRowsNumber = (window.innerHeight - 240) / this.rowHeight;
    this.mapColNumber = (window.innerWidth <= this.minWidth) ? 0 : 2;
    this.colNumber = (window.innerWidth <= this.minWidth) ? 1 : 4;
    this.priceColsNumber = (window.innerWidth <= this.minWidth) ? 1 : 2;
    this.paddingColsNumber = (window.innerWidth <= this.minWidth) ? 0 : 1;
    this.buttonWidth = (window.innerWidth <= this.minWidth) ? 90 : 95;
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

          this.markers = []

          this.isSearching = false;
          this.markers.push({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            draggable: true
          });
          this.map.triggerResize(false);
        }
      } else {
        this.isSearching = false;
        alert("Sorry, this search produced no results.");
      }
    },
    )
  }

  cityChanged(event, city) {
    if (!event.source.selected) return;
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

  neighborhoodChanged(event, neighborhood) {
    if (!event.source.selected) return;
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

  streetChanged(event, street) {
    if (!event.source.selected) return;
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
    if (null == val) {
      return options;
    }
    return options.filter(option =>
      option.toString().toLowerCase().indexOf(val.toString().toLowerCase()) === 0);
  }

  expandInfo(){
    this.infoRowNumber = 8;
  }

  hideInfo(){
    this.infoRowNumber = 1;
  }

  predict() {
    if (!this.isSearching) {

      var queryAsset = {
        "city": this.predictForm.value["city"],
        "data": [this.predictForm.value]
      }
      this.isSearching = true;
      setTimeout(() => {
        this.predictByYears();
        this.mlService.predict(queryAsset).subscribe(
          data => {
            console.log(data);
            this.isSearching = false;
            this.prediction = data[0];
          },
          error => {
            this.toast.open(error, 'danger');
          }
        );

      }, 3350);
    }
  }
  yearsArray: Number[] = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
  predictByYears() {
    var queryAssetByYears = {
      "city": this.predictForm.value["city"],
      "data": []
    };

    this.yearsArray.forEach(year => {
      var currentAsset = JSON.parse(JSON.stringify(this.predictForm.value));
      currentAsset["sale_day_year"] = year;
      queryAssetByYears.data.push(currentAsset);
    });
    console.log(queryAssetByYears);
    this.mlService.predict(queryAssetByYears).subscribe(
      data => {
        console.log(data);
        var i = 0;
        var chartData = [
          {
            "name": "מחיר",
            "series": []
          }
        ];
        data.forEach(price => {
          chartData[0]["series"].push({
            "name": this.yearsArray[i++].toString(),
            "value": Number.parseInt(price.toFixed(0))
          });
        });
        this.lineChartValues = chartData;
        console.log(this.lineChartValues);
      },
      error => {
        this.toast.open(error, 'danger');
      }
    );
  }

  lineChartValues = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'שנה';
  showYAxisLabel = false;
  yAxisLabel = 'מחיר';

  colorScheme = {
    domain: ['#734fbe']
  };

  // line, area
  autoScale = false;


}
