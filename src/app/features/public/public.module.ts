import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { PublicComponent } from '@app/features/public/public.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    SharedModule,
    PublicRoutingModule
  ],
  declarations: [PublicComponent, LoginComponent]
})
export class PublicModule { }
