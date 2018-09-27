import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from '@app/features/admin/admin.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from '@app/shared/shared.module';
import { AdminService } from '@app/features/admin/admin.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [AdminComponent, ManageUsersComponent, AdminDashboardComponent],
  providers: [AdminService]
})
export class AdminModule { }
