import { Component, OnInit } from '@angular/core';
// ng Modal
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-common-grid',
  templateUrl: './common-grid.component.html',
  styleUrls: ['./common-grid.component.scss']
})
export class CommonGridComponent implements OnInit {

  loader: boolean = true;
  closeBtnName: string;
  list: any[] = [];
  abc: string;
  rows = [];

  temp = [];

  columns = [
    { prop: 'name' },
    { name: 'Company' },
    { name: 'Gender' }
  ];

  constructor(public bsModalRef: BsModalRef) {
    this.fetch((data) => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      this.rows = data;
    });
  }

  ngOnInit() {
    this.list.push();
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      if (req.status === 200) {
        setTimeout(() => {
          this.loader = false;
          console.log(this.loader);
          // sending the null as an error and 2nd pram as a response
          cb(JSON.parse(req.response));
        }, 1000);
      }
    };

    req.send();
  }

  onActivate(event) {
    console.log(event);
  }

  onSelect(event) {
    console.log(event);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
