import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User, Class, Modul } from '@app/data-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DatabaseService } from '@app/core/services/database/database.service';

// Register  the provider in the module. New in Angular 6.

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  classCollection: AngularFirestoreCollection<Class>;
  modulCollection: AngularFirestoreCollection<Modul>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private db: DatabaseService) {
    this.userCollection = this.afs.collection('users');
    this.classCollection = this.afs.collection('classes');
    this.modulCollection = this.afs.collection('modules');
  }
  getRatingOverviewList(): Observable<any> {
    return this.db.colWithIds$('to_rate', ref => ref.where('status', '==', 'ended'));
  }

  getRatingDetailList(id): Observable<any> {
    return this.db.doc$(`to_rate/${id}`);
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
    return this.db.colWithIds$('modules', ref => ref.orderBy('name'));
  }

  getClasses(): Observable<Class[]> {
    return this.db.colWithIds$('classes', ref => ref.orderBy('name'));
  }

  getUser(id: string) {
    return this.afs.doc<User>(`user/${id}`);
  }

  getUserData(id: string) {
    this.userDoc = this.afs.doc<User>(`user/${id}`);
    return this.userDoc.valueChanges();
  }

  newUser(email: string, title: string, displayName: string, password: string, role: string, classId?: string) {
    return this.auth.createUserWithEmailAndPasswordAsAdmin(email, title, displayName, password, role, classId);
  }

  newClass(className: string, info: string) {
    const classesCollection = this.afs.collection<Class>('classes');
    const classData: Class = {
      name: className,
      info: info,
      students: 0
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
