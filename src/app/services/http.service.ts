import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RestApiService {

  constructor(
    private http: HttpClient
  ) { }

  // get method
  get(link: string, header: any) {
    return this.http.get(link, header)
    // .map((res) => res)
    // //...errors if any
    // .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // post method
  post(link: string, body: any, header: any) {
    return this.http.post(link, body, header);
  }

  // post method
  postD(link: string, body: any) {
    return this.http.post(link, body);
  }

  // update method
  update(link: string, body: any) {
    return this.http.put(link, body);
  }

  // delete method
  delete(link: string, body: any) {
    return this.http.delete(link, body);
  }

}
