import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TeacherService } from '@app/features/teacher/teacher.service';
import { Rating, User, Class, Modul } from '@app/data-model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectClassService } from '@app/shared/select-class/select-class.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Title } from '@angular/platform-browser';

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
  endRatingForm: FormGroup;
  isEditable = false;

  modules: Modul[];
  classId: string;
  moduleName: string;
  startDate: any;
  endDate: any;
  constructor(
    private auth: AuthService,
    private teacherService: TeacherService,
    private _formBuilder: FormBuilder,
    private selectClassService: SelectClassService,
    private title: Title) {
    this.getUser();
    this.selectClassService.selectedClass$.subscribe((classId) => {
      this.classId = classId;
    });
  }

  ngOnInit() {

    this.title.setTitle(this.title.getTitle() + ' - ' + this.pageTitle);
    this.startRatingForm = this._formBuilder.group({
      moduleName: ['', Validators.required],
      classId: '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
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
          ref.where('teacher', '==', user.displayName)).subscribe((data) => {

            this.openRatings = data;
            data.forEach(toRate => {
              this.teacherService.getEligibleStudents(toRate.classId).subscribe(classData => {
                this.eligibleStudents = classData.students;
              });
            });
          });

      }
    });
  }

  getUser() {
    return this.auth.user$.subscribe(user => (this.user = user));
  }

  startRating(form) {
    this.teacherService.startRating(
      this.user.displayName,
      this.classId,
      form.value.moduleName,
      form.value.startDate,
      form.value.endDate
    );
  }

  setCompleted() {
    this.endRatingForm.controls['secondCtrl'].setValue('done');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
