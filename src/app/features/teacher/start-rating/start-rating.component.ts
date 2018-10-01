import { Component, OnInit } from '@angular/core';
import { Class, Modul, User, Rating } from '@app/data-model';
import { TeacherService } from '@app/features/teacher/teacher.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectClassService } from '@app/shared/select-class/select-class.service';

@Component({
  selector: 'app-start-rating',
  templateUrl: './start-rating.component.html',
  styleUrls: ['./start-rating.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class StartRatingComponent implements OnInit {
  classes: Class[];
  modules: Modul[];
  user: User;
  classId: string;
  moduleId: string;
  startDate: any;
  endDate: any;

  constructor(private teacherService: TeacherService,
    private auth: AuthService,
    public fb: FormBuilder,
    private selectClassService: SelectClassService) {
    this.getUser();
    this.selectClassService.selectedClass$.subscribe((classId) => {
      this.classId = classId;
    }
    );
  }

  ngOnInit() {
    this.teacherService.getClasses().subscribe(classes => {
      this.classes = classes;
    });

    this.teacherService.getModules().subscribe(modules => {
      this.modules = modules;
    });
  }

  getUser() {
    return this.auth.user$.subscribe(user => (this.user = user));
  }

  startRating() {
    this.teacherService.startRating(
      this.user.displayName,
      this.classId,
      this.moduleId,
      this.startDate.toDate(),
      this.endDate.toDate()
    );
  }
}
