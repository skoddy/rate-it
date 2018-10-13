import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '@app/features/admin/admin.service';
import { BreakpointService } from '@app/features/admin/breakpoint.service';
import { SidesheetService } from '@app/features/admin/sidesheet.service';
import { Subscription } from 'rxjs';
import { FilterRatingsService } from '@app/features/admin/filter-ratings.service';
import { Modul, Rating } from '@app/data-model';

@Component({
  selector: 'app-manage-ratings',
  templateUrl: './manage-ratings.component.html',
  styleUrls: ['../admin.component.css']
})
export class ManageRatingsComponent implements OnInit, OnDestroy {
  ratingOverviewList: any;
  isHandset$ = this.breakpointService.isHandset$;
  isSidesheetOpen: boolean;
  sidesheetSub: Subscription;
  modulesSub: Subscription;
  ratingsSub: Subscription;
  moduleId: string;
  modulesList: Modul[];
  constructor(
    private adminService: AdminService,
    private breakpointService: BreakpointService,
    private sidesheetService: SidesheetService,
    public filterRatingsService: FilterRatingsService) {
    this.sidesheetSub = sidesheetService.state$.subscribe((state: boolean) => {
      this.isSidesheetOpen = state;
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
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.sidesheetSub.unsubscribe();
    this.modulesSub.unsubscribe();
    this.ratingsSub.unsubscribe();
    this.ratingOverviewList = null;
    this.filterRatingsService.filterByModule(null);
    console.log('destroy');

  }
  closeSidesheet() {
    this.sidesheetService.opened(false);
  }
}
