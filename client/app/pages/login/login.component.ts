import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ChatService } from '../../services/chat.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'Login';

  loginForm: FormGroup;
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(EMAIL_REGEX)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toast: ToastComponent,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.sendLoginMessage();//TODO add if admin to another page
      if (this.auth.isAdmin) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/ml']);
      }
    }
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  sendLoginMessage() {
    this.chatService.messages.next({
      type: 'login',
      message: this.auth.getToken()
    });
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      res => {
        this.sendLoginMessage();
        if (this.auth.isAdmin) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/ml']);
        }
      },
      error => this.toast.open('invalid email or password!', 'danger')
    );
  }
}
