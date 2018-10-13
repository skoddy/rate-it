import { Component, OnInit } from '@angular/core';
import { AdminService } from '@app/features/admin/admin.service';
import { BreakpointService } from '@app/features/admin/breakpoint.service';

@Component({
  selector: 'app-manage-ratings',
  templateUrl: './manage-ratings.component.html',
  styleUrls: ['../admin.component.css']
})
export class ManageRatingsComponent implements OnInit {
  ratingOverviewList: any;
  isHandset$ = this.breakpointService.isHandset$;
  constructor(private adminService: AdminService, private breakpointService: BreakpointService) {
    adminService.getRatingOverviewList().subscribe(data => this.ratingOverviewList = data);
  }

  ngOnInit() {
  }

}
