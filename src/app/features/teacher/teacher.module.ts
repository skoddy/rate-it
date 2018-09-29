import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from '@app/features/teacher/teacher.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModule
  ],
  declarations: [TeacherComponent]
})
export class TeacherModule { }
