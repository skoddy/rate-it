import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-modul',
  templateUrl: './new-modul.component.html',
  styleUrls: ['./new-modul.component.css']
})
export class NewModulComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewModulComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
