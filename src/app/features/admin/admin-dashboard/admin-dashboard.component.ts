import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  pageTitle = 'Dashboard';

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Bewertungen', cols: 2, rows: 1 },
          { title: 'Benutzer', cols: 2, rows: 1 },
          { title: 'Klassen', cols: 2, rows: 1 },
          { title: 'Module', cols: 2, rows: 1 }
        ];
      }

      return [
        { title: 'Bewertungen', cols: 1, rows: 1 },
        { title: 'Benutzer', cols: 1, rows: 1 },
        { title: 'Klassen', cols: 1, rows: 1 },
        { title: 'Module', cols: 1, rows: 1 }
      ];
    })
  );
  constructor(private breakpointObserver: BreakpointObserver,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
