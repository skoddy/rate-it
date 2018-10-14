import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['../admin.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  pageTitle = 'Dashboard';
  chart = [];
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
  ngAfterViewInit(): void {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Dokumente', 'Ausstattung', 'Evaluations', 'Übungen', 'Software', 'Unterstützung', 'Klima'],
        datasets: [{
          label: 'Durchschnitt',
          data: [2, 4, 3, 5, 2, 3, 6],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  ngOnInit() {
    this.title.setTitle(this.pageTitle);

  }

}
