import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/material/material.module';
import { RouterModule } from '@angular/router';
import { SelectClassComponent } from '@app/shared/select-class/select-class.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SelectClassComponent
  ],
  declarations: [SelectClassComponent]
})
export class SharedModule { }
