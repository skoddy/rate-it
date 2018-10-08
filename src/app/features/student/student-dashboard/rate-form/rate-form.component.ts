import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StudentService } from '@app/features/student/student.service';

@Component({
  selector: 'app-rate-form',
  templateUrl: './rate-form.component.html',
  styleUrls: ['./rate-form.component.css']
})

export class RateFormComponent implements OnInit {
  rateForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<RateFormComponent>,
    private _formBuilder: FormBuilder,
    public studentService: StudentService) { }

  ngOnInit() {
    this.rateForm = this._formBuilder.group({
      documents: ['', Validators.required],
      exercises: ['', Validators.required],
      software: ['', Validators.required],
      support: ['', Validators.required],
      evaluations: ['', Validators.required],
      working_climate: ['', Validators.required],
      equipment: ['', Validators.required],
      suggestions: ''
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close();
  }
}
