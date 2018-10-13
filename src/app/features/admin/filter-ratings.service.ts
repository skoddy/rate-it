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
  classRefFilter$: BehaviorSubject<DocumentReference | null>;

  constructor(private afs: AngularFirestore, private db: DatabaseService) {

    this.moduleRefFilter$ = new BehaviorSubject(null);
    this.classRefFilter$ = new BehaviorSubject(null);
    this.items$ = combineLatest(
      this.moduleRefFilter$,
      this.classRefFilter$
    ).pipe(
      switchMap(([moduleRef, classRef]) =>
        afs.collection('to_rate', ref => {
          let query: Query = ref;
          query = query.orderBy('endedAt', 'desc');
          if (moduleRef) { query = query.where('moduleRef', '==', moduleRef); }
          if (classRef) { query = query.where('classRef', '==', classRef); }
          return query;
        }).valueChanges()
      )
    );
  }

  filterByModule(id: string | null) {
    const moduleRef = id ? this.db.doc(`modules/${id}`).ref : null;
    this.moduleRefFilter$.next(moduleRef);
  }
  filterByClass(id: string | null) {
    const classRef = id ? this.db.doc(`classes/${id}`).ref : null;
    this.classRefFilter$.next(classRef);
  }

}
