import { Component } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { take, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public auth: AuthService) {
    this.auth.user$.subscribe(user => {
      this.auth.checkAuthorization(user);
    });

  }
}
