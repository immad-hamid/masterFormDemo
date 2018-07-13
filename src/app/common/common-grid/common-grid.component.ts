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

  // columns = [
  //   { prop: 'name' },
  //   { name: 'Company' },
  //   { name: 'Gender' }
  // ];

  columns = [
    { prop: 'status', name: 'Status' },
    { prop: 'ACTIVITY', name: 'Activity' },
    { prop: 'OPRN_ID', name: 'Op Id' },
    { prop: 'OPRN_NO', name: 'Op No.' },
    { prop: 'OPRN_VERS', name: 'Op Vers' },
    { prop: 'OPRN_NAME', name: 'Op Name' }
  ];

  constructor(public bsModalRef: BsModalRef) {
    this.fetch((data) => {
      this.loader = false;
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
    const obj = {
      iColumns: 1,
      iDisplayLength: 1,
      iDisplayStart: 1,
      iSortingCols: 1,
      sColumns: 1,
      sEcho: 1,
      sSearch: 1,
      sSearch_0: 1,
      sSearch_1: 1,
      sSearch_2: 1,
      sSearch_3: 1,
      sSearch_4: 1,
      Startdate: 1,
      Enddate: 1,
      States: 1,
      DAT: 1,
      EmptyPro: 1,
      OfferIDs: 1,
      CsvFile: 1,
      sSearch_5: 1,
      sSearch_6: 1,
      sSearch_7: 1,
      sSearch_8: 1,
      sSearch_9: 1,
      sSearch_10: 1,
      sSearch_11: 1,
      sSearch_12: 1,
      sSearch_18: 1,
      sSearch_17: 1,
      sSearch_16: 1,
      sSearch_15: 1,
      sSearch_14: 1,
      sSearch_13: 1,
      Displayname: 1,
      PositionValue: 1,
      PeriodValue: 1,
      FamilyIDCSV: 1,
      CommercialIDCSV: 1,
      TipiIDCSV: 1,
      OwnerDBCSV: 1,
      OnlyUnAssigned: 1,
      filterConflicted: 1,
      dataid: 12
    }
    const req = new XMLHttpRequest();
    req.open('POST', `http://C3-0467:8011/api/Values/GetList`, true);
    req.setRequestHeader('Content-type', 'application/json');
    // req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      // sending the null as an error and 2nd pram as a response
      cb(JSON.parse(req.response));
      // console.log(req.response);
    };

    req.send(obj);
    // req.send();
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
