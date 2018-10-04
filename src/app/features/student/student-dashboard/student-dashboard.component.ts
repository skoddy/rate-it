import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Rating } from '@app/data-model';
import { Observable, Subscription } from 'rxjs';
import { StudentService } from '@app/features/student/student.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  user: User;
  toRate: Rating[];
  subscription: Subscription;
  constructor(public studentService: StudentService, private auth: AuthService) {

  }

  ngOnInit() {
    this.subscription = this.auth.user$.subscribe(user => {
      if (user) {
        console.log(user.classId);
        this.studentService.getToRateObjects('to_rate', ref =>
          ref.where('classId', '==', user.classId)).subscribe(data => {
            this.toRate = data;
          });
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
