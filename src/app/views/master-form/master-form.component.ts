import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'master-form',
  templateUrl: './master-form.component.html',
  styleUrls: ['./master-form.component.scss']
})
export class MasterFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getmasterFormData(event) {
    console.log(event)
  }

}
