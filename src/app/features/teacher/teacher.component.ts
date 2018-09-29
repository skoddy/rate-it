import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  signOut() {
    this.auth.signOut();
  }
}
