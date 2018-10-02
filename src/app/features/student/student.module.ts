import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from '@app/features/student/student.component';
import { SharedModule } from '@app/shared/shared.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RateComponent } from './rate/rate.component';

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule
  ],
  declarations: [StudentComponent, StudentDashboardComponent, RateComponent]
})
export class StudentModule { }
