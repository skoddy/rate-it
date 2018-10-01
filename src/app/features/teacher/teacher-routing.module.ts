import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherComponent } from '@app/features/teacher/teacher.component';
import { StartRatingComponent } from '@app/features/teacher/start-rating/start-rating.component';

const routes: Routes = [
  { path: '', component: TeacherComponent,
  children: [
    { path: '', redirectTo: 'start-rating', pathMatch: 'full' },
    { path: 'start-rating', component: StartRatingComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
