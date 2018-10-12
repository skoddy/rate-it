import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from '@app/features/teacher/teacher.component';
import { SharedModule } from '@app/shared/shared.module';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModule
  ],
  declarations: [TeacherComponent, TeacherDashboardComponent]
})
export class TeacherModule { }
