import { Component } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { take, map, tap, filter } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public auth: AuthService, private router: Router) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    )
      .subscribe((event: NavigationStart) => {

        if (event.url === '/') {
          this.auth.user$.subscribe(user => {
            this.auth.checkAuthorization(user);
          });
        }

      });
  }
}
