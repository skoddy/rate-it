import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Rating, User } from '@app/data-model';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  toRateCollection: AngularFirestoreCollection<Rating>;

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

}
