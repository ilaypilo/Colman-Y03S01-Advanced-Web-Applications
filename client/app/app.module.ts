import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** Modules */
import { MaterialModule } from './material/material.module';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
/** Components */
import { AppComponent } from './app.component';
import {
  HomeComponent,
  SignupComponent,
  LoginComponent,
  LogoutComponent,
  AccountComponent,
  UsersComponent,
  ConnectedComponent,
  NotFoundComponent,
  AssetComponent,
  AssetsComponent,
  DealsComponent
} from './pages';
/** Services */
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CommentService } from './services/comment.service';
import { TokenInterceptor } from './services/token.interceptor';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AssetService } from './services/asset.service';
import { DealService } from './services/deal.service';
import { MatSortModule } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebsocketService } from './services/websocket.service';
import { ChatService } from './services/chat.service';
import { BarRatingModule } from "ngx-bar-rating";
import { AgmCoreModule } from '@agm/core';

const PAGES = [
  HomeComponent,
  SignupComponent,
  LoginComponent,
  LogoutComponent,
  AccountComponent,
  UsersComponent,
  ConnectedComponent,
  NotFoundComponent,
  AssetComponent,
  AssetsComponent,
  DealsComponent
];

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES
  ],
  imports: [
    RoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatSortModule,
    BarRatingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC9goo8rnqXdFBZ0wKt6cpPO3U-sJGOdZ0'
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    AssetService, 
    CommentService, 
    DealService,
    WebsocketService, 
    ChatService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
