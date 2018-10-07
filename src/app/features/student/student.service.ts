import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Rating, SubmittedRating } from '@app/data-model';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(public afs: AngularFirestore, private auth: AuthService) {

  }

  getToRateObjects(ref, queryFn?): Observable<Rating[]> {
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

  saveRating(form: SubmittedRating) {
    const ratingsCollection = this.afs.collection<SubmittedRating>('to_rate');
    const ratingData: SubmittedRating = {
      documents: form.documents,
      exercises: form.exercises,
      software: form.software,
      support: form.support,
      evaluations: form.evaluations,
      working_climate: form.working_climate,
      equipment: form.equipment,
      suggestions: form.suggestions
    };
    return ratingsCollection.add(ratingData);
  }
}
