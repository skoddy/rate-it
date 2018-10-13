import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Rating } from '@app/data-model';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { DatabaseService } from '@app/core/services/database/database.service';
import { Query } from '@firebase/firestore-types';
@Injectable({
  providedIn: 'root'
})
export class FilterRatingsService {
  items$: Observable<any[]>;
  moduleRefFilter$: BehaviorSubject<DocumentReference | null>;
  colorFilter$: BehaviorSubject<string | null>;

  constructor(private afs: AngularFirestore, private db: DatabaseService) {

    this.moduleRefFilter$ = new BehaviorSubject(null);
    this.colorFilter$ = new BehaviorSubject(null);
    this.items$ = combineLatest(
      this.moduleRefFilter$,
      this.colorFilter$
    ).pipe(
      switchMap(([moduleRef, color]) =>
        afs.collection('to_rate', ref => {
          let query: Query = ref;
          if (moduleRef) { query = query.where('moduleRef', '==', moduleRef); }
          if (color) { query = query.where('color', '==', color); }
          return query;
        }).valueChanges()
      )
    );
  }

  filterByModule(id: string | null) {
    const moduleRef = id ? this.db.doc(`modules/${id}`).ref : null;
    this.moduleRefFilter$.next(moduleRef);
  }
  filterByColor(color: string | null) {
    this.colorFilter$.next(color);
  }

}
