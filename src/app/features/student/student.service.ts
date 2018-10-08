import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Rating, SubmittedRating, User } from '@app/data-model';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DatabaseService } from '@app/core/services/database/database.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService implements OnDestroy {
  user: User;
  subscription: Subscription;
  toRate: Rating[];
  toRateId: string;

  constructor(public afs: AngularFirestore, private auth: AuthService, private db: DatabaseService) {
    this.subscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.getToRateObjects(user.classRef)
          .subscribe(toRate => {
            this.toRate = toRate;
            toRate.forEach(data => {
              this.toRateId = data.id;
            });
          });
      }
    });
  }

  getToRateObjects(classRef): Observable<Rating[]> {
    this.db.doc(`to_rate/${this.auth.uid}/`);
    return this.db.colWithIds$<Rating>('to_rate', ref => ref
      .where('classRef', '==', classRef)
      .where('status', '==', 'open'));
  }

  getStudentRef(): DocumentReference {
    return this.db.doc(`users/${this.auth.uid}`).ref;
  }
  newRating() {

  }
  saveRating(form: SubmittedRating) {
    const ratingsCollection = this.afs.doc<SubmittedRating>(`to_rate/${this.toRateId}/ratings/${this.auth.uid}`);
    const ratingData: SubmittedRating = {
      studentRef: this.getStudentRef(),
      documents: form.documents,
      exercises: form.exercises,
      software: form.software,
      support: form.support,
      evaluations: form.evaluations,
      working_climate: form.working_climate,
      equipment: form.equipment,
      suggestions: form.suggestions
    };

    return ratingsCollection.set(ratingData).then(() => this.increaseRatingsDone(this.toRateId));
  }
  private increaseRatingsDone(id: string) {
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
