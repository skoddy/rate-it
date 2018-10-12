import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSidenav } from '@angular/material';
import { AdminService } from '@app/features/admin/admin.service';
import { Modul } from '@app/data-model';
import { NewModulComponent } from '@app/features/admin/manage-modules/new-modul/new-modul.component';
import { Title } from '@angular/platform-browser';
import { SidesheetService } from '@app/features/admin/sidesheet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-modules',
  templateUrl: './manage-modules.component.html',
  styleUrls: ['../admin.component.css']
})
export class ManageModulesComponent implements OnInit, OnDestroy {

  pageTitle = 'Module';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sidesheet') public sideSheet: MatSidenav;
  displayedColumns: string[] = ['name'];
  modulDataSource: MatTableDataSource<Modul>;
  subscription: Subscription;
  mission: boolean;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private title: Title,
    private sidesheetService: SidesheetService
  ) {
    this.subscription = sidesheetService.missionAnnounced$.subscribe(
      mission => {
        this.mission = mission;
      });
  }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.sidesheetService.setSideNav(this.sideSheet);
    this.adminService.getModules().subscribe((user: Modul[]) => {

      // Assign the data to the data source for the table to render
      this.modulDataSource = new MatTableDataSource(user);
      this.modulDataSource.paginator = this.paginator;
      this.modulDataSource.sort = this.sort;

    }, (err => {
      console.log(err);
    }));
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(NewModulComponent, {
      maxWidth: '500px',
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.adminService.newModule(
          result.name
        );
      }
    });
  }

  applyFilter(filterValue: string) {
    this.modulDataSource.filter = filterValue.trim().toLowerCase();

    if (this.modulDataSource.paginator) {
      this.modulDataSource.paginator.firstPage();
    }
  }

  closeSidesheet() {
    this.sidesheetService.announceMission(false);
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
