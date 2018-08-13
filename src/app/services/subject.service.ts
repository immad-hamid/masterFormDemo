import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SubjectService {

  headerData: Subject<any> = new Subject<any>();
  
  gridData: Subject<any> = new Subject<any>();
  
  operationData: Subject<any> = new Subject<any>();
  
  RoutingClassData: Subject<any> = new Subject<any>();

  detailData: Subject<any> = new Subject<any>();

  handleInput: Subject<any> = new Subject<any>();

}