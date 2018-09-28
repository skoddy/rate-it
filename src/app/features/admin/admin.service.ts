import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User } from '@app/data-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AdminModule } from '@app/features/admin/admin.module';

// Register  the provider in the module. New in Angular 6.

@Injectable({
  providedIn: AdminModule
})

export class AdminService {

  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.userCollection = this.afs.collection('users');
  }

  getUsers(): Observable<User[]> {
    return this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUser(id: string) {
    return this.afs.doc<User>(`user/${id}`);
  }

  getUserData(id: string) {
    this.userDoc = this.afs.doc<User>(`user/${id}`);
    return this.userDoc.valueChanges();
  }

  newUser(email: string, displayName: string, password: string, role: string) {
    return this.auth.createUserWithEmailAndPasswordAsAdmin(email, displayName, password, role);
  }
}
