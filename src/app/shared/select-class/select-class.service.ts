import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Class, Modul, User } from '@app/data-model';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@app/core/services/auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectClassService {
  selectedClass$: Observable<any>;
  private selectedClassSubject = new Subject<any>();
  classCollection: AngularFirestoreCollection<Class>;
  modulCollection: AngularFirestoreCollection<Modul>;
  userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore) {
    this.classCollection = this.afs.collection('classes');
    this.modulCollection = this.afs.collection('modules');
    this.selectedClass$ = this.selectedClassSubject.asObservable();
  }
  selectedClass(data) {
    this.selectedClassSubject.next(data);
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
}