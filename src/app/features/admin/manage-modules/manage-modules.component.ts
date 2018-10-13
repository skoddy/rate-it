import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSidenav } from '@angular/material';
import { AdminService } from '@app/features/admin/admin.service';
import { Modul } from '@app/data-model';
import { NewModulComponent } from '@app/features/admin/manage-modules/new-modul/new-modul.component';
import { Title } from '@angular/platform-browser';
import { SidesheetService } from '@app/features/admin/sidesheet.service';
import { Subscription } from 'rxjs';
import { BreakpointService } from '@app/features/admin/breakpoint.service';

@Component({
  selector: 'app-manage-modules',
  templateUrl: './manage-modules.component.html',
  styleUrls: ['../admin.component.css']
})
export class ManageModulesComponent implements OnInit, OnDestroy {

  pageTitle = 'Module';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['name'];
  modulDataSource: MatTableDataSource<Modul>;
  subscription: Subscription;
  state: boolean;
  isHandset$ = this.breakpointService.isHandset$;
  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private title: Title,
    private sidesheetService: SidesheetService,
    private breakpointService: BreakpointService
  ) {
    this.subscription = sidesheetService.state$.subscribe(
      state => {
        this.state = state;
      });
  }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.adminService.getModules().subscribe((modules: Modul[]) => {

      // Assign the data to the data source for the table to render
      this.modulDataSource = new MatTableDataSource(modules);
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
    this.sidesheetService.opened(false);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
