import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './services/auth/admin.guard';
import { OfficeGuard } from '@app/core/services/auth/office.guard';
import { TeacherGuard } from '@app/core/services/auth/teacher.guard';
import { StudentGuard } from '@app/core/services/auth/student.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    loadChildren: '../public/public.module#PublicModule'
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: '../admin/admin.module#AdminModule'
  },
  {
    path: 'office',
    canActivate: [OfficeGuard],
    loadChildren: '../office/office.module#OfficeModule'
  },
  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    loadChildren: '../teacher/teacher.module#TeacherModule'
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    loadChildren: '../student/student.module#StudentModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
