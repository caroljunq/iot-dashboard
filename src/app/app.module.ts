import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';

import { CoreModule } from './@core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { UsersService, ACL } from './pages/users/users.service';

import { environment } from 'environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbSecurityModule,

    AngularFireModule.initializeApp(environment.firebase, 'iot-dash'),
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireAuthModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    NbSecurityModule.forRoot({
      accessControl: {
        ...ACL,
      },
    }).providers,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: FunctionsRegionToken, useValue: environment.firebase.functionsRegionToken },
    { provide: NbRoleProvider, useClass: UsersService },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
