import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewUserComponent>,
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