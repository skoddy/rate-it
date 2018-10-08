import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Rating } from '@app/data-model';
import { Subscription, Observable } from 'rxjs';
import { StudentService } from '@app/features/student/student.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MatDialog } from '@angular/material';
import { RateFormComponent } from '@app/features/student/student-dashboard/rate-form/rate-form.component';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  user: User;
  subscription: Subscription;
  toRate: Rating[];
  constructor(public studentService: StudentService, public dialog: MatDialog, ) {

  }

  ngOnInit() {
    this.toRate = this.studentService.toRate;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(RateFormComponent, {
      maxWidth: '840px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.studentService.newRating(
        );
      }
    });
  }

}
