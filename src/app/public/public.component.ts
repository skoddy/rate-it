import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '@app/data-model';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  user: User;
  signInForm: FormGroup;
  hide = true;

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });
    this.auth.user$.subscribe(user => (this.user = user));
  }

  ngOnInit() {
  }

  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }
  signOut() {
    return this.auth.signOut();
  }
  signIn() {
    return this.auth
      .emailSignIn(this.email.value, this.password.value)
      .then(u => {
        if (this.signInForm.valid) {
        }

        console.log('signed in!');
      });
  }
}
