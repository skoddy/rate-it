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
    this.classCollection = this.afs.collection('classes');
    this.modulCollection = this.afs.collection('modules');
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

  getCurrentUser() {
    this.userDoc = this.afs.doc<User>(`users/${this.auth.uid}`);
    return this.userDoc.valueChanges();
  }

  startRating(teacher: string, className: string, moduleName: string, start: Date, end: Date) {
    const ratingsCollection = this.afs.collection<Rating>(`to_rate`);
    const ratingsData: Rating = {
      teacher: teacher,
      className: className,
      moduleName: moduleName,
      start: start,
      end: end
    };
    ratingsCollection.add(ratingsData);
  }
}
