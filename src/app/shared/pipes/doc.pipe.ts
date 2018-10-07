import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from '@app/core/services/database/database.service';

@Pipe({
  name: 'doc'
})
export class DocPipe implements PipeTransform {

  constructor(private db: DatabaseService) {}

  transform(value: any): Observable<any> {
    return this.db.doc$(value.path);
  }

}
