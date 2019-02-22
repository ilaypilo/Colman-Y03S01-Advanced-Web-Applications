
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit  {
  isLoading = true;
  view: any[] = [1200, 250];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'עיר';
  showYAxisLabel = true;
  yAxisLabel = 'כמות נכסים';
  timeline = true;

  colorScheme = {
    domain: []
  };

  public singlePie = [];
  public singleBar = [];
  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    public dialog: MatDialog,
    public router: Router,
    private assetService: AssetService
  ) { }
  ngOnInit() {
      this.getAssetTypes();
      this.getAssetCities();
  }

  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  getAssetTypes(){
    this.assetService.getAssetTypes()
      .subscribe(
        data => {
          console.log(data)
          var arr = []
          for (var index in data) {
            arr.push(
              {
                "name": data[index]._id,
                "value": data[index].points
              }
            )
            this.colorScheme.domain.push(this.dynamicColors())
          }
          this.singlePie = arr;
        },
        error => console.log(error),
        () => this.isLoading = false
      );
  }

  getAssetCities(){
    this.assetService.getAssetCities()
      .subscribe(
        data => {
          console.log(data)
          var arr = []
          for (var index in data) {
            arr.push(
              {
                "name": data[index]._id,
                "value": data[index].points
              }
            )
            this.colorScheme.domain.push(this.dynamicColors())
          }
          this.singleBar = arr;
        },
        error => console.log(error),
        () => this.isLoading = false
      );
  }

  onSelectBar(event) {
    console.log(event);
    this.router.navigate(['/assets'], { queryParams: { city: event.name } });
  }
  onSelectPie(event) {
    console.log(event);
    this.router.navigate(['/assets'], { queryParams: { type: event.name } });
  }
}