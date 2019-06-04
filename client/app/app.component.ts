import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { DomSanitizer } from "@angular/platform-browser";
 import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userName: string;
  logoWidth: string;
  logoHeight: string;
  logoPadding: string;

  minWidth: number = 500;
  margin: string = "200px";
  showSmallIcon = false;

  constructor(
    public auth: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.userName = auth.currentUser.username;

    this.matIconRegistry.addSvgIcon(
      "ic_location",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icn_location.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ic_date",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icn_date.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ic_rooms",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icn_rooms.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ic_floor",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icn_floor.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ic_category",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icn_propery_category.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ic_size",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icn_size.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ic_user",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/btn_user.svg")
    );
  }

  ngOnInit() {
    this.resizeElements();
  }

  onResize(event) {
    this.resizeElements();
  }

  resizeElements() {
    this.logoHeight = (window.innerWidth <= this.minWidth) ? "40px" : "100px";
    this.logoWidth = (window.innerWidth <= this.minWidth) ? "40px" : "100px";
    this.logoPadding = (window.innerWidth <= this.minWidth) ? "20px" : "50px";
    this.margin = (window.innerWidth <= this.minWidth) ? "0px" : "200px";
    this.showSmallIcon = (window.innerWidth <= this.minWidth) ? true : false;
  }

}
