import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { RouterModule } from '@angular/router';
import { AdminGuard } from '@app/core/services/auth/admin.guard';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { OfficeGuard } from '@app/core/services/auth/office.guard';
import { TeacherGuard } from '@app/core/services/auth/teacher.guard';
import { StudentGuard } from '@app/core/services/auth/student.guard';
import { DatabaseService } from '@app/core/services/database/database.service';

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
    OfficeGuard,
    TeacherGuard,
    StudentGuard
  ]
})
export class CoreModule { }
