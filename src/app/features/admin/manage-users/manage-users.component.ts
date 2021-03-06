import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/data-model';
import { AdminService } from '@app/features/admin/admin.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NewUserComponent } from '@app/features/admin/manage-users/new-user/new-user.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['../admin.component.css']
})

export class ManageUsersComponent implements OnInit {

  pageTitle = 'Benutzer';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['displayName', 'email'];
  userDataSource: MatTableDataSource<User>;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);

    this.adminService.getUsers().subscribe((user: User[]) => {

      // Assign the data to the data source for the table to render
      this.userDataSource = new MatTableDataSource(user);
      this.userDataSource.paginator = this.paginator;
      this.userDataSource.sort = this.sort;

    }, (err => {
      console.log(err);
    }));
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(NewUserComponent, {
      maxWidth: '500px',
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.adminService.newUser(
          result.email,
          result.title,
          result.displayName,
          result.password,
          result.role,
          result.classId
        );
      }
    });
  }

  applyFilter(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();

    if (this.userDataSource.paginator) {
      this.userDataSource.paginator.firstPage();
    }
  }

}

