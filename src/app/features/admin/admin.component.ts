import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { SidenavService } from '@app/features/admin/sidenav.service';
import { Router, NavigationStart } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { SidesheetService } from '@app/features/admin/sidesheet.service';
import { BreakpointService } from '@app/features/admin/breakpoint.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  pageTitle = 'Admin';
  @ViewChild('drawer') public sideNav: MatSidenav;

  isHandset$ = this.breakpointService.isHandset$;
  handset: boolean;

  constructor(
    private auth: AuthService,
    private title: Title,
    private sideNavService: SidenavService,
    private sidesheetService: SidesheetService,
    private router: Router,
    private breakpointService: BreakpointService
  ) {


  }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.sideNavService.setSideNav(this.sideNav);
    this.isHandset$.subscribe(data => {
      this.handset = data;
    });

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
    this.sidesheetService.opened(true);
  }

}
