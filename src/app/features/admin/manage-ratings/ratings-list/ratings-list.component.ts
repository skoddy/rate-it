import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-ratings-list',
  templateUrl: './ratings-list.component.html',
  styleUrls: ['./ratings-list.component.css']
})
export class RatingsListComponent implements OnInit {
  id: string;
  private sub: any;
  ratingDetailList: any;

  constructor(private route: ActivatedRoute, private adminService: AdminService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.adminService.getRatingDetailList(this.id).subscribe(data => {
        this.ratingDetailList = data;
      });
      // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
