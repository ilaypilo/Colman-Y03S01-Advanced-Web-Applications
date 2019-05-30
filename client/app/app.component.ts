import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { ToastComponent } from './shared/toast/toast.component';

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
    private chatService: ChatService
  ) {
    chatService.messages.subscribe(data => {

    });
    this.userName = auth.currentUser.username;
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
