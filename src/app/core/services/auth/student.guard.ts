import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class StudentGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.student ? true : false),
      tap(isStudent => {
        if (!isStudent) {
          console.error('Access denied - Students only');
          this.router.navigate(['/'], { replaceUrl: true });
        }
      })
    );

  }
}
