import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherComponent } from '@app/features/teacher/teacher.component';
import { StartRatingComponent } from '@app/features/teacher/start-rating/start-rating.component';
import { TeacherDashboardComponent } from '@app/features/teacher/teacher-dashboard/teacher-dashboard.component';

const routes: Routes = [
  { path: '', component: TeacherComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: TeacherDashboardComponent },
    { path: 'start-rating', component: StartRatingComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
