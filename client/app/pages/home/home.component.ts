import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  colNumber: number;
  minWidth: number = 500;
  imgCol: number;
  constructor(public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.resizeElements();
    if (this.auth.loggedIn) {
      if (this.auth.isAdmin) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/ml']);
      }
    }
  }

  onResize(event) {
    this.resizeElements();
  }

  resizeElements() {
    this.colNumber = (window.innerWidth <= this.minWidth) ? 1 : 3;
    this.imgCol = (window.innerWidth <= this.minWidth) ? 1 : 2;

  }

}
