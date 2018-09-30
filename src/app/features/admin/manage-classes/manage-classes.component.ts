import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AdminService } from '@app/features/admin/admin.service';
import { Class } from '@app/data-model';
import { NewClassComponent } from '@app/features/admin/dialogs/new-class/new-class.component';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.css']
})

export class ManageClassesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'info', 'start', 'end'];
  classDataSource: MatTableDataSource<Class>;
  constructor(
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.adminService.getClasses().subscribe((user: Class[]) => {

      // Assign the data to the data source for the table to render
      this.classDataSource = new MatTableDataSource(user);
      this.classDataSource.paginator = this.paginator;
      this.classDataSource.sort = this.sort;

    }, (err => {
      console.log(err);
    }));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewClassComponent, {
      maxWidth: '500px',
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.adminService.newClass(
          result.name,
          result.info,
          result.start.toDate(),
          result.end.toDate()
        );
      }
    });
  }

  applyFilter(filterValue: string) {
    this.classDataSource.filter = filterValue.trim().toLowerCase();

    if (this.classDataSource.paginator) {
      this.classDataSource.paginator.firstPage();
    }
  }
}