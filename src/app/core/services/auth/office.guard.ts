import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class OfficeGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.office ? true : false),
      tap(isOffice => {
        if (!isOffice) {
          console.error('Access denied - Office only');
          this.router.navigate(['/'], { replaceUrl: true });
        }
      })
    );
  }
}
