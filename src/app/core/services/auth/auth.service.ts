import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { User } from '@app/data-model';
import { environment } from '@env/environment';
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

  // Returns the user id if authenticated otherwise null.
  get uid(): string {
    return this.authenticated ? this.authState.uid : null;
  }

  // Returns current user display name or Guest
  get displayName(): string {
    return this.authState.displayName || 'this.authState.email';
  }
  get className(): string {
    return this.authState.className || 'fehler';
  }
  // Returns current user photo
  get photoURL(): string {
    return this.authState.photoURL || '';
  }

  // Returns current user email
  get email(): string {
    return this.authState.email || '';
  }

  // Returns current user roles
  get roles(): string {
    return this.authState.roles || '';
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
      console.log('Signed Out!');
    });
  }

  createUserWithEmailAndPasswordAsAdmin(
    email: string,
    title: string,
    displayName: string,
    password: string,
    role: string,
    className?: string) {
    /*
    The createUserWithEmailAndPassword() function signs
    the user automaticly in, so we have to create a secondary app to create users,
    because we want to stay signed in as Admin.
    */

    const secondaryApp = firebase.initializeApp(environment.admin, 'admin');

    return secondaryApp.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        this.setUserData(credential.user, title, displayName, role, className);
        secondaryApp.auth().signOut();
        secondaryApp.delete()
          .then(function () {
            console.log('App deleted successfully');
          })
          .catch(function (error) {
            console.log('Error deleting app:', error);
          });
      });
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => console.log(user))
      .catch(error => console.log(error.message));
  }


  // If error, console log and toast user
  private handleError(error: Error) {
    console.error(error);
  }

  private setUserData(user, title, displayName, role, classId?: string) {

    if (role === 'student') {
      this.increaseStudents(classId);
    }

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      title: title,
      displayName: displayName,
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
      createdAt: new Date(),
      classId: classId ? classId : '',
      roles: {
        admin: (role === 'admin') ? true : false,
        office: (role === 'office') ? true : false,
        teacher: (role === 'teacher') ? true : false,
        student: (role === 'student') ? true : false,
      }
    };
    return userRef.set(data);
  }

  private increaseStudents(classId: string) {
    const classDocRef = this.afs.firestore.doc(`classes/${classId}`);

    return this.afs.firestore.runTransaction(transaction =>

      transaction.get(classDocRef).then(classDoc => {
        
        const newStudentCount = classDoc.data().students + 1;

        if (newStudentCount <= 100) {
          transaction.update(classDocRef, { students: newStudentCount });
          return newStudentCount;
        } else {
          return Promise.reject("Anzahl der Studenten von 100 überschritten.")
        }

      }))
      .then(newCount => console.log("Anzahl Schüler erhöht: " + newCount)
      ).catch(err => console.log(err));
  }
  // determines if user has matching role
  public checkAuthorization(user?: User) {
    const roles = ['admin', 'office', 'teacher', 'student'];
    let route: string;
    if (user) {
      for (const role of roles) {
        if (user.roles[role] === true) {
          route = role;
        }
      }
    } else {
      route = 'public';
    }
    return this.router.navigate([route], { replaceUrl: true });
  }
}
