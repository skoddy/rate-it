import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Class, User } from '@app/data-model';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectClassService {
  selectedClass$: Observable<any>;
  private selectedClassSubject = new Subject<any>();
  classCollection: AngularFirestoreCollection<Class>;
  userDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore) {
    this.classCollection = this.afs.collection('classes', ref =>
      ref.orderBy('name'));
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
