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
  title = 'rate-it';
  redirect() {
    console.log('asd');
    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.office ? true : false),
      tap(isOffice => {
        if (!isOffice) {
          console.error('Access denied - Office only');

        }
      })
    );
  }
  constructor(public auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(user => {

        this.auth.checkAuthorization(user);

    });

  }
}
