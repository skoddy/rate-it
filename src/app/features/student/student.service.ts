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
  getNewNumOfGrade(res, arr) {
    let grades = [];
    grades = res;
    switch (arr) {
      case '1':
        grades[0] = grades[0] + 1
        break;
      case '2':
        grades[1] = grades[1] + 1
        break;
      case '3':
        grades[2] = grades[2] + 1
        break;
      case '4':
        grades[3] = grades[3] + 1
        break;
      case '5':
        grades[4] = grades[4] + 1
        break;
      case '6':
        grades[5] = grades[5] + 1
        break;
      default:
        console.log('switch error');
        break;
    }
    return grades;
  }

  async addRatingTest(rating) {
    const documentsRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/documents`);
    const exercisesRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/exercises`);
    const softwareRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/software`);
    const supportRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/support`);
    const evaluationsRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/evaluations`);
    const working_climateRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/working_climate`);
    const equipmentRef = this.afs.firestore.doc(`to_rate/${rating.id}/statistics/equipment`);

    try {
      const newCount = await this.afs.firestore.runTransaction(transaction => transaction.get(documentsRef).then(res => {
        let grades = [];
        grades = this.getNewNumOfGrade(res.data().grades, rating.documents);
        transaction.update(documentsRef, { grades });
        return newCount;
      }));
    } catch (error) {
      console.log(error);
    }
    try {
      const newCount = await this.afs.firestore.runTransaction(transaction => transaction.get(exercisesRef).then(res => {
        let grades = [];
        grades = this.getNewNumOfGrade(res.data().grades, rating.exercises);
        transaction.update(exercisesRef, { grades });
        return newCount;
      }));
    } catch (error) {
      console.log(error);
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
          'documents': (oldRatingTotal.documents + parseInt(rating.documents)) / newNumRatings,
          'equipment': (oldRatingTotal.equipment + parseInt(rating.equipment)) / newNumRatings,
          'evaluations': (oldRatingTotal.evaluations + parseInt(rating.evaluations)) / newNumRatings,
          'exercises': (oldRatingTotal.exercises + parseInt(rating.exercises)) / newNumRatings,
          'software': (oldRatingTotal.software + parseInt(rating.software)) / newNumRatings,
          'support': (oldRatingTotal.support + parseInt(rating.support)) / newNumRatings,
          'working_climate': (oldRatingTotal.working_climate + parseInt(rating.working_climate)) / newNumRatings,
        };
        transaction.update(toRateDocRef, { average, studentsDone: newNumRatings, students: newStudentsArray });
        transaction.set(ratingRef, ratingData);
        return average;
      }));
      return console.log('Durchschnitt berechnet: ' + newCount);
    }
    catch (err) {
      return console.log(err);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
