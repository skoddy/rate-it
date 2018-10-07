import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Class, Modul, User, Rating } from '@app/data-model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DatabaseService } from '@app/core/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  classCollection: AngularFirestoreCollection<Class>;
  modulCollection: AngularFirestoreCollection<Modul>;
  userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore, private auth: AuthService, private db: DatabaseService) {

    this.modulCollection = this.afs.collection('modules', ref =>
      ref.orderBy('name'));
    this.classCollection = this.afs.collection('classes', ref =>
      ref.orderBy('name'));
  }
  getModule(to_rateId) {
    return this.db.doc$(`to_rate/${to_rateId}`).pipe(
      switchMap((doc: Rating) => {
        return this.db.doc$(doc.moduleRef.path);
      }
      ));
  }
  getClass(to_rateId) {
    return this.db.doc$(`to_rate/${to_rateId}`).pipe(
      switchMap((doc: Rating) => {
        return this.db.doc$(doc.classRef.path);
      }
      ));
  }
  getModulesTwo(): Observable<Modul[]> {
    return this.db.colWithIds$('modules', ref => ref.orderBy('name'));
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
  getOpenRatings(): Observable<Rating[]> {
    return this.db.colWithIds$('to_rate');
  }

  getEligibleStudents(classId): Observable<Class> {
    const classDoc = this.afs.doc<Class>(`classes/${classId}`);
    return classDoc.valueChanges();
  }

  getCurrentUser() {
    this.userDoc = this.afs.doc<User>(`users/${this.auth.uid}`);
    return this.userDoc.valueChanges();
  }

  startRating(teacherId: string, classId: string, moduleId: string, start: Date, end: Date) {
    const ratingsCollection = this.afs.collection<Rating>('to_rate');
    const teacherRef = this.db.doc(`users/${teacherId}`);
    const classRef = this.db.doc(`classes/${classId}`);
    const moduleRef = this.db.doc(`modules/${moduleId}`);
    const ratingsData: Rating = {
      teacherRef: teacherRef.ref,
      classRef: classRef.ref,
      moduleRef: moduleRef.ref,
      start: start,
      end: end
    };
    return ratingsCollection.add(ratingsData);
  }
}
