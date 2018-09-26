import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '@app/data-model';

@Injectable()
export class AuthService {

  user$: Observable<User | null>;

  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })

    );
    this.afAuth.authState.subscribe(data => this.authState = data);
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get uid(): string {
    return this.authenticated ? this.authState.uid : null;
  }

  // Returns current user display name or Guest
  get displayName(): string {
    return this.authState.displayName || this.authState.email;
  }

  // Returns current user photo
  get photoURL(): string {
    return this.authState.photoURL || '';
  }

  // Returns current user email
  get email(): string {
    return this.authState.email || '';
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
      console.log('Signed Out!');
    });
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then((credential)=> {
      this.updateUserData(credential.user);
    });
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((credential) => {
        this.updateUserData(credential.user);
        console.log('You have successfully signed in');
      })
      .catch(error => console.log(error.message));
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  // If error, console log and toast user
  private handleError(error: Error) {
    console.error(error);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName,
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
      roles: {
        subscriber: true
      }
    };

    return userRef.set(data, { merge: true });

  }
  ///// Role-based Authorization //////
  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }
  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }
  
  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }



  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }
}