import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StudentService } from '@app/features/student/student.service';
import { SubmittedRating, Rating } from '@app/data-model';

@Component({
  selector: 'app-rate-form',
  templateUrl: './rate-form.component.html',
  styleUrls: ['./rate-form.component.css']
})

export class RateFormComponent implements OnInit {
  rateForm: FormGroup;
  toRate: {};
  id: any;
  moduleName: any;
  constructor(public dialogRef: MatDialogRef<RateFormComponent>,
    private _formBuilder: FormBuilder,
    public studentService: StudentService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.id = data.id;
    this.moduleName = data.moduleName;

  }

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

  save(form: SubmittedRating) {
    const data = {
      id: this.id,
      documents: form.documents,
      exercises: form.exercises,
      software: form.software,
      support: form.support,
      evaluations: form.evaluations,
      working_climate: form.working_climate,
      equipment: form.equipment,
      suggestions: form.suggestions
    };
    
    this.dialogRef.close(data);

  }
}
