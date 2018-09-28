import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/data-model';
import { AdminService } from '@app/features/admin/admin.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})

export class ManageUsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['displayName', 'email', 'role'];
  dataSource: MatTableDataSource<User>;
  newUserForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.adminService.getUsers().subscribe((user: User[]) => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(user);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err => {
      console.log(err);
    }));
    this.createForm();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createForm(): any {
    this.newUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  createUser() {
    console.log('create user');
    this.adminService.newUser(
      this.newUserForm.get('email').value,
      this.newUserForm.get('name').value,
      this.newUserForm.get('password').value,
      this.newUserForm.get('role').value);
  }
}

