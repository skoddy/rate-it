import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/material/material.module';
import { RouterModule } from '@angular/router';
import { SelectClassComponent } from '@app/shared/select-class/select-class.component';
import { DocPipe } from './pipes/doc.pipe';
import { HeaderComponent } from './header/header.component';

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
    SelectClassComponent,
    HeaderComponent,
    DocPipe
  ],
  declarations: [SelectClassComponent, DocPipe, HeaderComponent]
})
export class SharedModule { }
