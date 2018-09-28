import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from '@app/features/admin/admin.component';
import { ManageUsersComponent } from '@app/features/admin/manage-users/manage-users.component';
import { AdminDashboardComponent } from '@app/features/admin/admin-dashboard/admin-dashboard.component';
import { ManageClassesComponent } from '@app/features/admin/manage-classes/manage-classes.component';
import { ManageModulesComponent } from '@app/features/admin/manage-modules/manage-modules.component';
import { ManageRatingsComponent } from '@app/features/admin/manage-ratings/manage-ratings.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'ratings', component: ManageRatingsComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'classes', component: ManageClassesComponent },
      { path: 'modules', component: ManageModulesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
