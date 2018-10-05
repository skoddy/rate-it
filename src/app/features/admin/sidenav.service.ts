import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sideNav: MatSidenav;
  constructor() { }

  public setSideNav(sideNav: MatSidenav) {
    this.sideNav = sideNav;
  }

  public close(): Promise<MatDrawerToggleResult> {
    return this.sideNav.close();
  }
}
