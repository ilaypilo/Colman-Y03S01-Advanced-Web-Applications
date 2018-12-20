import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../shared/models/asset.model';
import { MatIconModule } from '../../shared/confirm/confirmation-dialog';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})

export class AssetComponent implements OnInit {

  title = 'Registered Asset';
  asset: Asset;
  isLoading = true;
  id: string;
  private sub: any;

  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private assetService: AssetService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];
        this.getAsset(this.id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAsset(id) {
    this.assetService.getAsset(id).subscribe(
      data => {
        this.asset = data;
      },
      error => {
        console.log(error)
        this.router.navigate(['/notfound'])
      },
      () => this.isLoading = false,
    );
  }
}