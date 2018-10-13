import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SidesheetService {

  private stateSource = new Subject<boolean>();
  state$ = this.stateSource.asObservable();

  constructor() { }

  opened(state: boolean) {
    this.stateSource.next(state);
  }

}
