import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '@app/features/admin/admin.service';
import { BreakpointService } from '@app/features/admin/breakpoint.service';
import { SidesheetService } from '@app/features/admin/sidesheet.service';
import { Subscription } from 'rxjs';
import { FilterRatingsService } from '@app/features/admin/filter-ratings.service';
import { Modul, Rating, Class } from '@app/data-model';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-manage-ratings',
  templateUrl: './manage-ratings.component.html',
  styleUrls: ['../admin.component.css'],
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ]),
    trigger('explainerAnimation', [
      transition('* => *', [
        query('.col', style({ opacity: 0, transform: 'translateX(-40px)' })),

        query('.col', stagger('500ms', [
          animate('800ms 1.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ])),

        query('.col', [
          animate(1000, style('*'))
        ])

      ])
    ])
  ],
})

export class ManageRatingsComponent implements OnInit, OnDestroy {
  ratingOverviewList: any;
  isHandset$ = this.breakpointService.isHandset$;
  isSidesheetOpen: boolean;
  sidesheetSub: Subscription;
  ratingsSub: Subscription;
  modulesSub: Subscription;
  classesSub: Subscription;
  moduleId: string;
  modulesList: Modul[];
  classId: string;
  classList: Class[];
  constructor(
    private adminService: AdminService,
    private breakpointService: BreakpointService,
    private sidesheetService: SidesheetService,
    public filterRatingsService: FilterRatingsService) {
    this.sidesheetSub = sidesheetService.state$.subscribe((sheetstate: boolean) => {
      this.isSidesheetOpen = sheetstate;
    }, (err => {
      console.log(err);
    }));

    this.ratingsSub = this.filterRatingsService.items$.subscribe((ratings: Rating[]) => {
      this.ratingOverviewList = ratings;
    }, (err => {
      console.log(err);
    }));

    this.modulesSub = this.adminService.getModules().subscribe((modules: Modul[]) => {
      this.modulesList = modules;
    }, (err => {
      console.log(err);
    }));

    this.classesSub = this.adminService.getClasses().subscribe((classes: Class[]) => {
      this.classList = classes;
    }, (err => {
      console.log(err);
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.sidesheetSub.unsubscribe();
    this.modulesSub.unsubscribe();
    this.classesSub.unsubscribe();
    this.ratingsSub.unsubscribe();
    this.filterRatingsService.filterByModule(null);
    this.filterRatingsService.filterByClass(null);
  }

  closeSidesheet() {
    this.sidesheetService.opened(false);
  }
}
