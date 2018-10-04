import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeDe, 'de');
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebase, 'main-app'),
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
