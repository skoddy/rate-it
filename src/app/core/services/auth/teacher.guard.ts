import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class TeacherGuard implements CanActivate {

  constructor(private auth: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.teacher ? true : false),
      tap(isTeacher => {
        if (!isTeacher) {
          console.error('Access denied - Teachers only');
        }
      })
    );

  }
}

