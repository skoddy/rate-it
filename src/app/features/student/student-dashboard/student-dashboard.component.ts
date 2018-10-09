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
  toRate: Observable<Rating[]>;
  ratingExists: boolean;
  constructor(public studentService: StudentService, public dialog: MatDialog, ) {

  }

  ngOnInit() {
    this.toRate = this.studentService.getToRateObjects();
  }

  openDialog(id: string, moduleName): void {
    console.log(id);
    console.log(moduleName);
    
    
    const dialogRef = this.dialog.open(RateFormComponent, {
      maxWidth: '840px',
      data: {
        id: id,
        moduleName: moduleName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.studentService.saveRating(result).then(()=>console.log('Bewertung gespeichert'));
      }
    });
  }

}
