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
  AdminComponent,
  NotFoundComponent,
  AssetComponent,
  AssetsComponent
} from './pages';
/** Services */
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/token.interceptor';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AssetService } from './services/asset.service';
import { MatSortModule } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


const PAGES = [
  HomeComponent,
  SignupComponent,
  LoginComponent,
  LogoutComponent,
  AccountComponent,
  AdminComponent,
  NotFoundComponent,
  AssetComponent,
  AssetsComponent
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
    MatSortModule
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
    AssetService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
