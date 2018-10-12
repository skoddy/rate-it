import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { SidenavService } from '@app/features/admin/sidenav.service';
import { Router, NavigationStart } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { SidesheetService } from '@app/features/admin/sidesheet.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  pageTitle = 'Admin';
  @ViewChild('drawer') public sideNav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  handset: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private title: Title,
    private sideNavService: SidenavService,
    private sidesheetService: SidesheetService,
    private router: Router
  ) {


  }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.sideNavService.setSideNav(this.sideNav);
    this.isHandset$.subscribe(data => { this.handset = data; });

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart && this.handset) {
          this.sideNavService.close().then(() => { });
        }
      });
  }

  signOut() {
    this.auth.signOut();
  }
  openSidesheet() {
    this.sidesheetService.announceMission(true);
  }

}
