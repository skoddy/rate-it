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



  setStatusDone(id) {
    const ratingsCollection = this.afs.doc(`to_rate/${id}`);
    return ratingsCollection.set({ students: [this.auth.uid] }, { merge: true });
  }
  getNewNumOfGrade(grades, arr) {
    console.log(grades);
    console.log(arr);


    switch (arr) {
      case '1':
        grades[1] = grades[1] + 1;
        break;
      case '2':
        grades[2] = grades[2] + 1;
        break;
      case '3':
        grades[3] = grades[3] + 1;
        break;
      case '4':
        grades[4] = grades[4] + 1;
        break;
      case '5':
        grades[5] = grades[5] + 1;
        break;
      case '6':
        grades[6] = grades[6] + 1;
        break;
      default:
        console.log('switch error');
        break;
    }
    console.log(grades);
    return grades;
  }



  async addRatingTest(rating) {
    const toRateDocRef = this.afs.firestore.doc(`to_rate/${rating.id}`);
    const ratingRef = toRateDocRef.collection(`ratings`).doc(`${this.auth.uid}`);
    const ratingData: SubmittedRating = {
      studentRef: this.studentRef,
      documents: rating.documents,
      exercises: rating.exercises,
      software: rating.software,
      support: rating.support,
      evaluations: rating.evaluations,
      working_climate: rating.working_climate,
      equipment: rating.equipment,
      suggestions: rating.suggestions
    };

    try {
      const newCount = await this.afs.firestore.runTransaction(transaction => transaction.get(toRateDocRef).then(res => {
        // Compute new number of ratings
        const newNumRatings = res.data().studentsDone + 1;
        // Get the students array and
        // push this student to the 'students who have done the rating' array
        let newStudentsArray = [];
        newStudentsArray = res.data().students;
        newStudentsArray.push(this.auth.uid);

        const newRatingStats = {
          r_documents:  res.data().r_documents
        };

        // Compute new average ratings
        const oldRatingTotal = [
          newRatingStats.r_documents * res.data().studentsDone,
          res.data().r_equipment[0] * res.data().studentsDone,
          res.data().r_evaluations[0] * res.data().studentsDone,
          res.data().r_exercises[0] * res.data().studentsDone,
          res.data().r_software[0] * res.data().studentsDone,
          res.data().r_support[0] * res.data().studentsDone,
          res.data().r_working_climate[0] * res.data().studentsDone
        ];
        newRatingStats.r_documents[0] = (oldRatingTotal[0] + parseInt(rating.documents, 10)) / newNumRatings;
newRatingStats.r_documents = newRatingStats.r_documents.concat(this.getNewNumOfGrade(res.data().r_documents, rating.documents));


console.log(newRatingStats.r_documents);

        transaction.update(toRateDocRef, {
          r_documents: newRatingStats.r_documents, studentsDone: newNumRatings, students: newStudentsArray });
        transaction.set(ratingRef, ratingData);
        return newRatingStats;
      }));
      return console.log('Durchschnitt berechnet: ' + newCount);
    } catch (err) {
      return console.log(err);
    }
  }

  async addRating(rating) {
    const toRateDocRef = this.afs.firestore.doc(`to_rate/${rating.id}`);
    const ratingRef = toRateDocRef.collection(`ratings`).doc(`${this.auth.uid}`);
    const ratingData: SubmittedRating = {
      studentRef: this.studentRef,
      documents: rating.documents,
      exercises: rating.exercises,
      software: rating.software,
      support: rating.support,
      evaluations: rating.evaluations,
      working_climate: rating.working_climate,
      equipment: rating.equipment,
      suggestions: rating.suggestions
    };

    try {
      const newCount = await this.afs.firestore.runTransaction(transaction => transaction.get(toRateDocRef).then(res => {
        // Compute new number of ratings
        const newNumRatings = res.data().studentsDone + 1;
        // Add this student to the 'students who have done the rating' array
        let newStudentsArray = [];
        newStudentsArray = res.data().students;
        newStudentsArray.push(this.auth.uid);
        // Compute new average ratings
        const oldRatingTotal = {
          'documents': (res.data().average.documents * res.data().studentsDone),
          'equipment': (res.data().average.equipment * res.data().studentsDone),
          'evaluations': (res.data().average.evaluations * res.data().studentsDone),
          'exercises': (res.data().average.exercises * res.data().studentsDone),
          'software': (res.data().average.software * res.data().studentsDone),
          'support': (res.data().average.support * res.data().studentsDone),
          'working_climate': (res.data().average.working_climate * res.data().studentsDone)
        };

        const average = {
          'documents': (oldRatingTotal.documents + parseInt(rating.documents, 10)) / newNumRatings,
          'equipment': (oldRatingTotal.equipment + parseInt(rating.equipment, 10)) / newNumRatings,
          'evaluations': (oldRatingTotal.evaluations + parseInt(rating.evaluations, 10)) / newNumRatings,
          'exercises': (oldRatingTotal.exercises + parseInt(rating.exercises, 10)) / newNumRatings,
          'software': (oldRatingTotal.software + parseInt(rating.software, 10)) / newNumRatings,
          'support': (oldRatingTotal.support + parseInt(rating.support, 10)) / newNumRatings,
          'working_climate': (oldRatingTotal.working_climate + parseInt(rating.working_climate, 10)) / newNumRatings,
        };
        transaction.update(toRateDocRef, { average, studentsDone: newNumRatings, students: newStudentsArray });
        transaction.set(ratingRef, ratingData);
        return average;
      }));
      return console.log('Durchschnitt berechnet: ' + newCount);
    } catch (err) {
      return console.log(err);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
