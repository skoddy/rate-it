import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
pageTitle = 'Teacher';
  constructor(private auth: AuthService, private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }
  signOut() {
    this.auth.signOut();
  }
}
