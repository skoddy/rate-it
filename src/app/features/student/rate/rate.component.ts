import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from '@app/features/student/student.service';
import { SubmittedRating } from '@app/data-model';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {

  rateForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private studentService: StudentService) { }

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
  save(form: SubmittedRating) {
    console.log(form);

/*     this.studentService.saveRating(form)
      .then(() => {
        console.log('done');

      }); */
  }
}
