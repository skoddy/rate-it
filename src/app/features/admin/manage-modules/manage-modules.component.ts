import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AdminService } from '@app/features/admin/admin.service';
import { Modul } from '@app/data-model';
import { NewModulComponent } from '@app/features/admin/dialogs/new-modul/new-modul.component';

@Component({
  selector: 'app-manage-modules',
  templateUrl: './manage-modules.component.html',
  styleUrls: ['./manage-modules.component.css']
})
export class ManageModulesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name'];
  modulDataSource: MatTableDataSource<Modul>;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
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
}
