import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Rating } from '@app/data-model';
import { Subscription, Observable } from 'rxjs';
import { StudentService } from '@app/features/student/student.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  user: User;
  subscription: Subscription;
  toRate: Rating[];
  constructor(public studentService: StudentService, private auth: AuthService) {

  }

  ngOnInit() {
this.toRate = this.studentService.toRate;
  }
 

}
