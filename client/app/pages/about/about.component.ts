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
  minWidth: number = 500;
  textWidth:number;

  constructor(
    public toast: ToastComponent
  ) { }

  ngOnInit() {
    this.resizeElements();
    this.isLoading = false;
  }

  onResize(event) {
    this.resizeElements();
  }
  
  resizeElements() {
    this.textWidth = (window.innerWidth <= this.minWidth) ? 90 : 50;
  }
}
