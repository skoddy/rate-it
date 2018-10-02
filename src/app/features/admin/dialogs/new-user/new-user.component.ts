import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectClassService } from '@app/shared/select-class/select-class.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private selectClassService: SelectClassService) {
    this.selectClassService.selectedClass$.subscribe((className) => {
      this.data.className = className;
    }
    );
  }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
  
  close() {
    console.log(this.data);
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
