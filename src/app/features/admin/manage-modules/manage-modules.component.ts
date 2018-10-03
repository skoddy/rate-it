import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AdminService } from '@app/features/admin/admin.service';
import { Modul } from '@app/data-model';
import { NewModulComponent } from '@app/features/admin/manage-modules/new-modul/new-modul.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-manage-modules',
  templateUrl: './manage-modules.component.html',
  styleUrls: ['./manage-modules.component.css']
})
export class ManageModulesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['select', 'name'];
  modulDataSource: MatTableDataSource<Modul>;
  selection = new SelectionModel<Modul>(true, []);

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.modulDataSource.data.length;
    console.log(numSelected);
    if (numSelected > 0) {

    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.modulDataSource.data.forEach(row => this.selection.select(row));
  }
}
