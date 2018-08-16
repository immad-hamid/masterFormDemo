import { IROUTING } from './../models/customers.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable, BehaviorSubject } from '../../../node_modules/rxjs';

@Injectable()
export class SubjectService {

  headerData: Subject<any> = new Subject<any>();
  
  gridData: Subject<any> = new Subject<any>();
  
  operationData: Subject<any> = new Subject<any>();
  
  RoutingClassData: Subject<any> = new Subject<any>();

  detailData: Subject<any> = new Subject<any>();

  EnableDisableInput: Subject<any> = new Subject<any>();

  RoutingData: Subject<any> = new Subject<any>();

  private countSource = new Subject<string>();
  count = this.countSource.asObservable();
  updateCount(count: string) {
    this.countSource.next(count);
  }

}