import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Rating, SubmittedRating, User } from '@app/data-model';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DatabaseService } from '@app/core/services/database/database.service';
import { map, take, startWith, scan, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService implements OnDestroy {

  user: User;
  subscription: Subscription;
  studentRef: DocumentReference;
  ratingExists: boolean;

  constructor(public afs: AngularFirestore, private auth: AuthService, private db: DatabaseService) {
    this.user = this.auth.userData;
    this.studentRef = this.getStudentRef();
  }

  getOpenRating(): Observable<Rating[]> {
    return this.db.colWithIds$<Rating>('to_rate', ref => ref
      .where('classRef', '==', this.user.classRef)
      .where('status', '==', 'open')).pipe(
        map(data => data.filter(task => task.students.indexOf(this.auth.uid) === -1))
      );
  }

  getStudentRef(): DocumentReference {
    return this.db.doc(`users/${this.auth.uid}`).ref;
  }

  saveRating(data) {
    const ratingsCollection = this.afs.doc<SubmittedRating>(`to_rate/${data.id}/ratings/${this.auth.uid}`);
    const ratingData: SubmittedRating = {
      studentRef: this.studentRef,
      documents: data.documents,
      exercises: data.exercises,
      software: data.software,
      support: data.support,
      evaluations: data.evaluations,
      working_climate: data.working_climate,
      equipment: data.equipment,
      suggestions: data.suggestions
    };

    return ratingsCollection.set(ratingData).then(() => {
      this.setStatusDone(data.id);
      this.increaseRatingsDone(data.id);
    });
  }

  setStatusDone(id) {
    const ratingsCollection = this.afs.doc(`to_rate/${id}`);
    ratingsCollection.set({ students: [this.auth.uid] }, { merge: true });
  }

  increaseRatingsDone(id: string) {
    const toRateDocRef = this.afs.firestore.doc(`to_rate/${id}`);

    return this.afs.firestore.runTransaction(transaction =>

      transaction.get(toRateDocRef).then(toRateDoc => {

        const studentsDoneCount = toRateDoc.data().studentsDone + 1;

        if (studentsDoneCount <= 100) {
          transaction.update(toRateDocRef, { studentsDone: studentsDoneCount });
          return studentsDoneCount;
        } else {
          return Promise.reject('Anzahl der Studenten von 100 überschritten.');
        }

      }))
      .then(newCount => console.log('Anzahl fertige Bewertungen erhöht: ' + newCount)
      ).catch(err => console.log(err));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
