import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from '@app/features/public/public.component';
import { LoginComponent } from '@app/features/public/login/login.component';

const routes: Routes = [
  { path: '', component: PublicComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
