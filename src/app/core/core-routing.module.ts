import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@app/core/services/auth/admin.guard';
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
    loadChildren: '../features/public/public.module#PublicModule'
  },
  {
    path: 'admin',
    // canActivate: [AdminGuard],
    loadChildren: '../features/admin/admin.module#AdminModule'
  },
  {
    path: 'office',
    // canActivate: [OfficeGuard],
    loadChildren: '../features/office/office.module#OfficeModule'
  },
  {
    path: 'teacher',
    // canActivate: [TeacherGuard],
    loadChildren: '../features/teacher/teacher.module#TeacherModule'
  },
  {
    path: 'student',
    // canActivate: [StudentGuard],
    loadChildren: '../features/student/student.module#StudentModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
