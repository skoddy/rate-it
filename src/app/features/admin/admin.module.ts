import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from '@app/features/admin/admin.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from '@app/shared/shared.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@env/environment';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'admin-app'),
  ],
  declarations: [AdminComponent, ManageUsersComponent, AdminDashboardComponent],
  providers: []
})
export class AdminModule { }
