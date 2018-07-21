import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '../../../../../node_modules/@angular/forms';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'master-form-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  masterFormData: any;
  activities: any;
  resources: any;

  private fieldArray: Array<any> = [];
  private newAttribute: any = {};

  constructor(
    private subService: SubjectService
  ) {
    this.fetchActivities((data) => {
      this.activities = [...data];
    });

    this.fetchResources((data) => {
      this.resources = [...data];
    });

    this.subService.headerData.subscribe((data) => {
      this.masterFormData = data;
      console.log(this.masterFormData);
    });
  }

  addFieldValue() {
    this.newAttribute.disabled = true;
    this.newAttribute.rowEditMode = false;
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
    console.log(this.fieldArray);
  }

  editFieldValue(index) {
    this.fieldArray[index].disabled = false;
    this.fieldArray[index].rowEditMode = true;
  }

  addAfterEdit(index) {
    this.fieldArray[index].disabled = true;
    this.fieldArray[index].rowEditMode = false;
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  submit(f) {
    console.log(f);
  }

  ngOnInit() { }

  fetchActivities(cb) {
    const req = new XMLHttpRequest;
    req.open('GET', 'http://C3-0467:8011/api/Values/GetAllActivity', true);

    req.onload = () => {
      if (req.status === 200) {
        cb(JSON.parse(req.response));
      }
    }
    req.send();
  }

  fetchResources(cb) {
    const req = new XMLHttpRequest;
    req.open('GET', 'http://C3-0467:8011/api/Values/GetAllResource', true);

    req.onload = () => {
      if (req.status === 200) {
        cb(JSON.parse(req.response));
      }
    }
    req.send();
  }

  // saveData() {
  //   const obj = {
  //     status: '2',
  //     ACTIVITY: '',
  //     RESOURCE: '',
  //     OPRN_ID: '0',
  //     OPRN_NO: '',
  //     OPRN_VERS: '2',
  //     OPRN_NAME: this.masterFormData.operation,
  //     OPERATION_STATUS: this.masterFormData.status,
  //     OPRN_CLASS_ID: this.masterFormData.class,
  //     OPRN_CLASS: '',
  //     OPRN_CLASS_NAME: '',
  //     ORGANIZATION_ID: '1947',
  //     MFG_OPERATION_DETAILS: [{
  //       OPRN_ACT_RES_ID: 0,
  //       OPRN_ACT_ID: 190,
  //       RESOURCE_ID: this.resourcesf.value,
  //       LINE_NO: this.lineNum.value,
  //       OPRN_ID: 1781,
  //       ACTIVITY_ID: parseInt(this.activity.value),
  //       ACTIVITY: 1,
  //       ACTIVITY_NAME: 2,
  //       RESOURCE: 158,
  //       RESOURCE_NAME: null,
  //       RESOURCE_USAGE: '2017-07-01T00:00:00',
  //       USAGE_UM: null,
  //       PROCESS_QTY: this.proQuan.value,
  //       PROCESS_UOM: ''
  //     }]
  //   }

  //   const req = new XMLHttpRequest();
  //   req.open('POST', `http://C3-0467:8011/api/Values/Save`, true);
  //   req.setRequestHeader('Content-type', 'application/json');

  //   req.onreadystatechange = function () {//Call a function when the state changes.
  //     if (req.readyState == 4 && req.status == 200) {
  //       alert(JSON.parse(req.responseText));
  //       console.log(JSON.stringify(obj));
  //       // alert(req.responseText);
  //     }
  //   }

  //   req.send(JSON.stringify(obj));
  // }

}