import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { RouterModule } from '@angular/router';
import { AdminGuard } from '@app/core/services/auth/admin.guard';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [],
  providers: [
    AdminGuard,
    AuthService
  ]
})
export class CoreModule { }
