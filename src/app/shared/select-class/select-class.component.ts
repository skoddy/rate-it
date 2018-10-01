import { Component, OnInit } from '@angular/core';
import { Class } from '@app/data-model';
import { SelectClassService } from '@app/shared/select-class/select-class.service';

@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.component.html',
  styleUrls: ['./select-class.component.css']
})

export class SelectClassComponent implements OnInit {

  classes: Class[];
  classId: string;
  public data: any;
  constructor(public selectClassService: SelectClassService) {
    this.selectClassService.selectedClass(this.data);
    this.data = this.classId;
  }

  ngOnInit() {
    this.selectClassService.getClasses().subscribe(classes => {
      this.classes = classes;
    });
  }

}
