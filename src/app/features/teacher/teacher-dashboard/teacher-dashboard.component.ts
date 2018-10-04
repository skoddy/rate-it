import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TeacherService } from '@app/features/teacher/teacher.service';
import { Rating, User, Class } from '@app/data-model';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  openRatings: any;
  user: User;
  subscription: Subscription;
  eligibleStudents: any;
  constructor(private auth: AuthService, private teacherService: TeacherService) { }

  ngOnInit() {
    this.subscription = this.auth.user$.subscribe((user: User) => {
      if (user) {
        console.log(user.displayName);
        this.teacherService.getOpenRatings('to_rate', ref =>
          ref.where('teacher', '==', user.displayName)).subscribe((data) => {
            console.log(data);
            this.openRatings = data;
            data.forEach(toRate => {
              this.teacherService.getEligibleStudents(toRate.classId).subscribe(classData => {
                this.eligibleStudents = classData.students;
              });
            })
          });

      }
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
