import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Class, Modul, User, Rating } from '@app/data-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  classCollection: AngularFirestoreCollection<Class>;
  modulCollection: AngularFirestoreCollection<Modul>;
  userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore, private auth: AuthService) {

    this.modulCollection = this.afs.collection('modules', ref =>
      ref.orderBy('name'));
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

  getOpenRatings(ref, queryFn?): Observable<Rating[]> {
    return this.afs.collection(ref, queryFn).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Rating;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getEligibleStudents(classId): Observable<Class> {
    const classDoc = this.afs.doc<Class>(`classes/${classId}`);
    return classDoc.valueChanges();
  }

  getCurrentUser() {
    this.userDoc = this.afs.doc<User>(`users/${this.auth.uid}`);
    return this.userDoc.valueChanges();
  }

  startRating(teacher: string, classId: string, moduleName: string, start: Date, end: Date) {
    const ratingsCollection = this.afs.collection<Rating>('to_rate');
    const ratingsData: Rating = {
      teacher: teacher,
      classId: classId,
      moduleName: moduleName,
      start: start,
      end: end
    };
    ratingsCollection.add(ratingsData);
  }
}
