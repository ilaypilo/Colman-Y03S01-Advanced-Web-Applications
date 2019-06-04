import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  title = 'אודות';
  isLoading = true;

  constructor(
    public toast: ToastComponent
  ) { }

  ngOnInit() {
    this.isLoading = false;
  }
}
