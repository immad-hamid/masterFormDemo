import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SubjectService {

  headerData: Subject<any> = new Subject<any>();

}