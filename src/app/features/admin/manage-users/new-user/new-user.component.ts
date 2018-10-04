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

    this.selectClassService.selectedClass$.subscribe((classId) => {
      this.form.controls['classId'].setValue(classId);
    });

    this.form = fb.group({
      'title': ['', Validators.required],
      'displayName': ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      'role': ['', Validators.required],
      'password': ['', Validators.required],
      'classId': ['']
    });
  }

  ngOnInit() {
  }

  onSubmit(form): void {
    if (form.value.role !== 'student') {
      form.value.className = undefined;
    }
    console.log(form.value);
    this.dialogRef.close(form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
