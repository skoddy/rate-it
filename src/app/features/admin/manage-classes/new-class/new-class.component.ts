import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css'],
})

export class NewClassComponent implements OnInit {

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewClassComponent>,
    public fb: FormBuilder) {

    this.form = fb.group({
      'className': ['', Validators.required],
      'info': ''
    });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form) {
    this.dialogRef.close(form.value);
  }
}
