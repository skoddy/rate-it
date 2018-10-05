import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TeacherService } from '@app/features/teacher/teacher.service';
import { Rating, User, Class, Modul } from '@app/data-model';
import { Subscription } from 'rxjs';
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
  openRatings: Rating[];
  user: User;
  subscription: Subscription;
  eligibleStudents: number;

  completed = false;
  startRatingForm: FormGroup;
  startRatingCompleted = false;
  endRatingForm: FormGroup;
  endRatingCompleted = false;
  ratingCompleted = false;
  isEditable = false;
  classes: Class[];
  modules: Modul[];
  classId: string;
  moduleName: string;
  startDate: any;
  endDate: any;
  processing: boolean;
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
      moduleName: ['', Validators.required],
      classId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });


    this.teacherService.getClasses().subscribe(classes => {
      this.classes = classes;
    });

    this.teacherService.getModules().subscribe(modules => {
      this.modules = modules;
    });

    this.endRatingForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.subscription = this.auth.user$.subscribe((user: User) => {
      if (user) {

        this.teacherService.getOpenRatings('to_rate', ref =>
          ref.where('teacher', '==', user.displayName)).subscribe((openRating) => {

            if (openRating.length > 0) {
              console.log(openRating);
              this.isOptional = true;
              this.startRatingCompleted = true;
              this.currentIndex = 1;
            } else {
              this.currentIndex = 0;
              this.setStartRatingForm();
            }
            this.processing = false;

            this.openRatings = openRating;
            openRating.forEach(toRate => {
              this.teacherService.getEligibleStudents(toRate.classId).subscribe(classData => {

                this.eligibleStudents = classData.students;
              });
            });
          });
      }
    });
  }

  setStartRatingForm() {
    this.startRatingForm = this._formBuilder.group({
      moduleName: ['', Validators.required],
      classId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }
  getUser() {
    return this.auth.user$.subscribe(user => (this.user = user));
  }

  startRating(stepper: MatStepper, form) {
    this.teacherService.startRating(
      this.user.displayName,
      form.value.classId,
      form.value.moduleName,
      form.value.startDate.toDate(),
      form.value.endDate.toDate()
    ).then(() => {
      stepper.next();
    });
  }

  setCompleted() {
    this.endRatingCompleted = true;
    this.endRatingForm.controls['secondCtrl'].setValue('done');
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
