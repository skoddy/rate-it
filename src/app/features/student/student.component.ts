import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  signOut() {
    this.auth.signOut();
  }
}
