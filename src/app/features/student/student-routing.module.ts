import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from '@app/features/student/student.component';
import { StudentDashboardComponent } from '@app/features/student/student-dashboard/student-dashboard.component';
import { RateComponent } from '@app/features/student/rate/rate.component';

const routes: Routes = [
  {
    path: '', component: StudentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: RateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
