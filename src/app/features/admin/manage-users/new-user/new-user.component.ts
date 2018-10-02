import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SelectClassService } from '@app/shared/select-class/select-class.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  form: FormGroup;
  className: any;

  constructor(public dialogRef: MatDialogRef<NewUserComponent>,
    private selectClassService: SelectClassService,
    public fb: FormBuilder) {

    this.selectClassService.selectedClass$.subscribe((className) => {
      this.form.controls['className'].setValue(className);
    });

    this.form = fb.group({
      'title': ['', Validators.required],
      'displayName': ['', Validators.required],
      'email': ['', Validators.required],
      'role': ['', Validators.required],
      'password': ['', Validators.required],
      'className': ['']
    });
  }

  ngOnInit() {
  }

  onSubmit(form): void {
    console.log(form.value);
    this.dialogRef.close(form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
