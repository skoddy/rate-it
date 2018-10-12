import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidesheetService {
  private sideSheet: MatSidenav;
  private missionAnnouncedSource = new Subject<boolean>();
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  constructor() { }

  announceMission(mission: boolean) {
    console.log(mission);

    this.missionAnnouncedSource.next(mission);
  }

  public setSideNav(sideSheet: MatSidenav) {
    this.sideSheet = sideSheet;
  }

  public open(): Promise<MatDrawerToggleResult> {
    return this.sideSheet.open();
  }
  public close(): Promise<MatDrawerToggleResult> {
    return this.sideSheet.close();
  }
}
