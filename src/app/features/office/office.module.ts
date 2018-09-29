import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeComponent } from '@app/features/office/office.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SharedModule
  ],
  declarations: [OfficeComponent]
})
export class OfficeModule { }
