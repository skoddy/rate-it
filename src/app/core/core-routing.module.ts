import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './services/auth/admin.guard';

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
    canActivate: [AdminGuard],
    loadChildren: '../office/office.module#OfficeModule'
  },
  {
    path: 'teacher',
    canActivate: [AdminGuard],
    loadChildren: '../teacher/teacher.module#TeacherModule'
  },
  {
    path: 'student',
    canActivate: [AdminGuard],
    loadChildren: '../student/student.module#StudentModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
