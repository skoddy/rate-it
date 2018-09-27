import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/data-model';
import { AdminService } from '@app/features/admin/admin.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  users$: Observable<User[]>;
  newUserForm: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder) { }

  /* getErrorMessage() {
    return this.newUserForm.get('email').hasError('required') ? 'Pflichtfeld' :
        this.newUserForm.hasError('email') ? 'Keine gültige E-Mail Adresse' :
            '';
  } */
  ngOnInit() {
    this.users$ = this.adminService.getUsers();
    this.createForm();
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
    this.adminService.newUser(this.newUserForm.get('email').value, this.newUserForm.get('password').value, this.newUserForm.get('role').value);
  }

}
