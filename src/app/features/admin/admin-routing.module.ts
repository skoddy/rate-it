import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from '@app/features/admin/admin.component';
import { ManageUsersComponent } from '@app/features/admin/manage-users/manage-users.component';
import { AdminDashboardComponent } from '@app/features/admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardComponent},
    { path: 'manage-users', component: ManageUsersComponent }
] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
