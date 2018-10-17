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
    console.log('grades vor berechnung: ' + grades);
    console.log(arr);


    switch (arr) {
      case '1':
        grades[0] = grades[0] + 1;
        break;
      case '2':
        grades[1] = grades[1] + 1;
        break;
      case '3':
        grades[2] = grades[2] + 1;
        break;
      case '4':
        grades[3] = grades[3] + 1;
        break;
      case '5':
        grades[4] = grades[4] + 1;
        break;
      case '6':
        grades[5] = grades[5] + 1;
        break;
      default:
        console.log('switch error');
        break;
    }
    console.log('grades nach berechnung: ' + grades);
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

        let oldDocumentsArray = res.data().r_documents;
        let oldEquipmentArray = res.data().r_equipment;
        let oldEvaluationsArray = res.data().r_evaluations;
        let oldExercisesArray = res.data().r_exercises;
        let oldSoftwareArray = res.data().r_software;
        let oldSupportArray = res.data().r_support;
        let oldWorkingClimateArray = res.data().r_working_climate;

        oldDocumentsArray[0] = [res.data().r_documents[0] * res.data().studentsDone];
        oldEquipmentArray[0] = [res.data().r_equipment[0] * res.data().studentsDone];
        oldEvaluationsArray[0] = [res.data().r_evaluations[0] * res.data().studentsDone];
        oldExercisesArray[0] = [res.data().r_exercises[0] * res.data().studentsDone];
        oldSoftwareArray[0] = [res.data().r_software[0] * res.data().studentsDone];
        oldSupportArray[0] = [res.data().r_support[0] * res.data().studentsDone];
        oldWorkingClimateArray[0] = [res.data().r_working_climate[0] * res.data().studentsDone];

        const newDocumentsAverage = [(parseInt((oldDocumentsArray[0]), 10) + parseInt(rating.documents, 10)) / newNumRatings];
        const newEquipmentAverage = [(parseInt((oldEquipmentArray[0]), 10) + parseInt(rating.equipment, 10)) / newNumRatings];
        const newEvaluationsAverage = [(parseInt((oldEvaluationsArray[0]), 10) + parseInt(rating.evaluations, 10)) / newNumRatings];
        const newExercisesAverage = [(parseInt((oldExercisesArray[0]), 10) + parseInt(rating.exercises, 10)) / newNumRatings];
        const newSoftwareAverage = [(parseInt((oldSoftwareArray[0]), 10) + parseInt(rating.software, 10)) / newNumRatings];
        const newSupportAverage = [(parseInt((oldSupportArray[0]), 10) + parseInt(rating.support, 10)) / newNumRatings];
        const newWorkingClimateAverage = [(parseInt((oldWorkingClimateArray[0]), 10) + parseInt(rating.working_climate, 10)) / newNumRatings];

        oldDocumentsArray.shift();
        oldEquipmentArray.shift();
        oldEvaluationsArray.shift();
        oldExercisesArray.shift();
        oldSoftwareArray.shift();
        oldSupportArray.shift();
        oldWorkingClimateArray.shift();

        const documentsGradesArray = this.getNewNumOfGrade(oldDocumentsArray, rating.documents);
        const equipmentGradesArray = this.getNewNumOfGrade(oldEquipmentArray, rating.equipment);
        const evaluationsGradesArray = this.getNewNumOfGrade(oldEvaluationsArray, rating.evaluations);
        const exercisesGradesArray = this.getNewNumOfGrade(oldExercisesArray, rating.exercises);
        const softwareGradesArray = this.getNewNumOfGrade(oldSoftwareArray, rating.software);
        const supportGradesArray = this.getNewNumOfGrade(oldSupportArray, rating.support);
        const wokingClimateGradesArray = this.getNewNumOfGrade(oldWorkingClimateArray, rating.working_climate);

        const calculatedDocumentsArray = newDocumentsAverage.concat(documentsGradesArray);
        const calculatedEquipmentArray = newEquipmentAverage.concat(equipmentGradesArray);
        const calculatedEvaluationsArray = newEvaluationsAverage.concat(evaluationsGradesArray);
        const calculatedExercisesArray = newExercisesAverage.concat(exercisesGradesArray);
        const calculatedSoftwareArray = newSoftwareAverage.concat(softwareGradesArray);
        const calculatedSupportArray = newSupportAverage.concat(supportGradesArray);
        const calculatedWorkingClimateArray = newWorkingClimateAverage.concat(wokingClimateGradesArray);

        transaction.update(toRateDocRef, {
          r_documents: calculatedDocumentsArray,
          r_equipment: calculatedEquipmentArray,
          r_evaluations: calculatedEvaluationsArray,
          r_exercises: calculatedExercisesArray,
          r_software: calculatedSoftwareArray,
          r_support: calculatedSupportArray,
          r_working_climate: calculatedWorkingClimateArray,
          studentsDone: newNumRatings,
          students: newStudentsArray
        });
        transaction.set(ratingRef, ratingData);
        return calculatedDocumentsArray;
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
