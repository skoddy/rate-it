import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TeacherService } from '@app/features/teacher/teacher.service';
import { Rating, User, Class, Modul } from '@app/data-model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Title } from '@angular/platform-browser';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  pageTitle = 'Dashboard';
  user: User;
  subscription: Subscription;

  // Step 1
  startRatingForm: FormGroup;
  startRatingCompleted = false;
  classes: Class[];
  modules: Modul[];
  classId: string;
  moduleId: string;
  startDate: any;
  endDate: any;

  // Step 2
  openRatings: Rating[];
  endRatingForm: FormGroup;
  endRatingCompleted = false;
  ratingCompleted = false;

  // Step 3
  ratingsDone: number;

  // Stepper Config
  processing: boolean;
  isEditable = false;
  currentIndex = 0;
  isOptional = false;

  constructor(
    private auth: AuthService,
    private teacherService: TeacherService,
    private _formBuilder: FormBuilder,
    private title: Title) {
    this.getUser();
  }

  ngOnInit() {
    this.processing = true;
    this.title.setTitle(this.title.getTitle() + ' - ' + this.pageTitle);

    this.startRatingForm = this._formBuilder.group({
      moduleId: ['', Validators.required],
      classId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startRatingDone: ['', Validators.required]
    });

    this.endRatingForm = this._formBuilder.group({
      endRatingDone: ['', Validators.required]
    });

    this.teacherService.getModules().subscribe(data => this.modules = data);

    this.teacherService.getClasses().subscribe(data => this.classes = data);

    this.subscription = this.teacherService.getOpenRatings()
      .subscribe(openRating => {

        if (openRating.length > 0) {
          console.log(openRating);
          this.isOptional = true;
          this.startRatingCompleted = true;
          this.currentIndex = 1;

        } else {
          this.currentIndex = 0;
        }
        this.processing = false;
        this.openRatings = openRating;
      });
  }

  getUser() {
    return this.auth.user$.subscribe(user => (this.user = user));
  }

  endRating(id: string, stepper: MatStepper): void {
    this.teacherService.endRating(id)
      .then(() => {
        this.endRatingCompleted = true;
        this.endRatingForm.controls['endRatingDone'].setValue('done');
        stepper.next();
        console.log('Bewertung beendet.');
      });
  }

  startRating(stepper: MatStepper, form) {
    return this.teacherService.startRating(
      this.user.uid,
      form.value.classId,
      form.value.moduleId,
      form.value.startDate.toDate(),
      form.value.endDate.toDate()
    ).then(() => {
      this.startRatingForm.controls['startRatingDone'].setValue('done');
      stepper.next();
    });
  }

  setCompleted() {

  }

  done(stepper: MatStepper) {
    this.startRatingCompleted = false;
    this.endRatingCompleted = false;
    this.isOptional = false;
    stepper.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
