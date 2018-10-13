import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BreakpointService {

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  handset: boolean;

  constructor(private breakpointObserver: BreakpointObserver) { }
}
