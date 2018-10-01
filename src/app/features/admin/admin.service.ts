import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User, Class, Modul } from '@app/data-model';
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
  classCollection: AngularFirestoreCollection<Class>;
  modulCollection: AngularFirestoreCollection<Modul>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.userCollection = this.afs.collection('users');
    this.classCollection = this.afs.collection('classes');
    this.modulCollection = this.afs.collection('modules');
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

  getModules(): Observable<Modul[]> {
    return this.modulCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Modul;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getClasses(): Observable<Class[]> {
    return this.classCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Class;
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

  newClass(name: string, info: string) {
    const classesCollection = this.afs.collection<Class>('classes');
    const classData: Class = {
      name: name,
      info: info
    };
    classesCollection.add(classData);
  }

  newModule(name: string) {
    const modulesCollection = this.afs.collection<Modul>('modules');
    const modulData: Modul = {
      name: name
    };
    modulesCollection.add(modulData);
  }
}
