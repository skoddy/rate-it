import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from '@app/features/admin/admin.component';
import { SharedModule } from '@app/shared/shared.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@env/environment';
import { MyTableComponent } from './my-table/my-table.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';
import { ManageModulesComponent } from './manage-modules/manage-modules.component';
import { ManageRatingsComponent } from './manage-ratings/manage-ratings.component';
import { NewUserComponent } from '@app/features/admin/manage-users/new-user/new-user.component';
import { NewModulComponent } from '@app/features/admin/manage-modules/new-modul/new-modul.component';
import { NewClassComponent } from '@app/features/admin/manage-classes/new-class/new-class.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'admin-app'),
  ],
  declarations: [
    AdminComponent,
    ManageUsersComponent,
    AdminDashboardComponent,
    NewUserComponent,
    NewClassComponent,
    ManageClassesComponent,
    ManageModulesComponent,
    ManageRatingsComponent,
    MyTableComponent,
    NewModulComponent
  ],
  providers: [],
  entryComponents: [NewUserComponent, NewClassComponent, NewModulComponent]
})
export class AdminModule { }
