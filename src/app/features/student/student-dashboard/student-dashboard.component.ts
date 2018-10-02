import { Component, OnInit } from '@angular/core';
import { User, Rating } from '@app/data-model';
import { Observable } from 'rxjs';
import { StudentService } from '@app/features/student/student.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  user: User;
  toRate: Rating[];
  constructor(public studentService: StudentService, private auth: AuthService) {

  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      console.log(user.className);
      this.studentService.getToRateObjects('to_rate', ref =>
        ref.where('className', '==', user.className)).subscribe(data => {
          this.toRate = data;
        });
    })
  }

}
