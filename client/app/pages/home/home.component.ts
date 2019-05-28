import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (this.auth.loggedIn) {
      if (this.auth.isAdmin) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/ml']);
      }
    }
  }
}
