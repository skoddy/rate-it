import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AdminService } from '@app/features/admin/admin.service';
import { Class } from '@app/data-model';
import { NewClassComponent } from '@app/features/admin/manage-classes/new-class/new-class.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['../admin.component.css']
})

export class ManageClassesComponent implements OnInit {

  pageTitle = 'Klassen';
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'info'];
  classDataSource: MatTableDataSource<Class>;
  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.adminService.getClasses().subscribe((classes: Class[]) => {

      // Assign the data to the data source for the table to render
      this.classDataSource = new MatTableDataSource(classes);
      this.classDataSource.paginator = this.paginator;
      this.classDataSource.sort = this.sort;
      this.isLoadingResults = false;

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
        console.log(result);
        this.adminService.newClass(
          result.className,
          result.info
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
