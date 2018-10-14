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
    trigger('flyInOut', [
      transition('* => *', [
        animate(300, keyframes([
          style({opacity: 0, offset: 0}),
          style({opacity: .5, offset: 0.3}),
          style({opacity: 1, offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
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
