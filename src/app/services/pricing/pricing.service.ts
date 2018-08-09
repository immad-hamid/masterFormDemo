import { Injectable } from '@angular/core';
import { RestApiService } from '../http.service';

@Injectable()
export class PricingService {

  constructor(private http: RestApiService) { }

  getUsers() {
    return this.http.get('https://jsonplaceholder.typicode.com/users', '');
  }

  getActivities() {
    return this.http.get('http://C3-0467:8011/api/Values/GetAllActivity', '');
  }

  getResources() {
    return this.http.get('http://C3-0467:8011/api/Values/GetAllResource', '');
  }

  getGridData(id) {
    return this.http.get(`http://C3-0467:8011/api/Values/GetOperationByID?operationID=${id}`, '')
  }

  fetchList(body) {
    return this.http.post('http://C3-0467:8011/api/Values/GetList', body, '')
  }
}
