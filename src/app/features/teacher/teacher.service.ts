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
  i = 0;
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

  getModules(): Observable<Modul[]> {
    return this.db.colWithIds$('modules', ref => ref.orderBy('name'));
  }

  getClasses(): Observable<Class[]> {
    return this.db.colWithIds$('classes', ref => ref.orderBy('name'));
  }

  getOpenRatings(): Observable<Rating[]> {
    return this.db.colWithIds$('to_rate', ref => ref
      .where('teacherRef', '==', this.getCurrentUser())
      .where('status', '==', 'open'));
  }


  getCurrentUser() {
    return this.db.doc<User>(`users/${this.auth.uid}`).ref;
  }
  getNumberOfDoneRatings(id) {

    const ratingsCollection = this.db.col$<Rating>(`to_rate/${id}/ratings`);
    ratingsCollection.subscribe(data => {
      this.i = data.length;
    });
    console.log('service nr: ' + this.i);
    return this.i;
  }
  startRating(teacherId: string, classId: string, moduleId: string, start: Date, end: Date) {
    const ratingsCollection = this.db.col<Rating>('to_rate');
    const teacherRef = this.db.doc(`users/${teacherId}`);
    const classRef = this.db.doc(`classes/${classId}`);
    const moduleRef = this.db.doc(`modules/${moduleId}`);
    const ratingsData: Rating = {
      teacherRef: teacherRef.ref,
      classRef: classRef.ref,
      moduleRef: moduleRef.ref,
      start: start,
      end: end,
      status: 'open',
      studentsDone: 0,
      students: []
    };
    return ratingsCollection.add(ratingsData);
  }
}
