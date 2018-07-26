import { Component, OnDestroy } from '@angular/core';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'master-form-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnDestroy {
  masterFormData: any;
  activities: any;
  resources: any;
  activityEl: any;

  dtoSave: any;

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

    // header data
    this.subService.headerData.subscribe((data) => {
      this.masterFormData = data;
      console.log(this.masterFormData);
    });
    // operation data
    this.subService.operationData.subscribe((data) => {
      const opData = data.operationData;
      console.log(opData);
      this.populateLineItems(opData);
    });
  }

  ngOnDestroy() {
    this.subService.headerData.unsubscribe();
  }

  populateLineItems(opData) {
    const lineItems = opData.MFG_OPERATION_DETAILS;

    lineItems.forEach(
      (lineItem) => {
        const obj = {
          activities: {
            ACTIVITY: lineItem.ACTIVITY,
            ACTIVITY_ID: lineItem.ACTIVITY_ID,
            ACTIVITY_NAME: lineItem.ACTIVITY_NAME
          },
          resources: {
            RESOURCE: lineItem.RESOURCE,
            RESOURCE_ID: lineItem.RESOURCE_ID,
            RESOURCE_NAME: lineItem.RESOURCE_NAME
          },
          description: lineItem.ACTIVITY_NAME,
          lineNum: lineItem.LINE_NO,
          proQuan: lineItem.PROCESS_QTY,
          disabled: true,
          rowEditMode: false
        }
        this.fieldArray.push(obj);
      }
    );
  }

  // adding activity description
  addActivityDesc(select) {
    this.newAttribute.description = select.value.ACTIVITY_NAME
  }

  addFieldValue(lineNumber, description, proQuan) {
    this.newAttribute.disabled = true;
    this.newAttribute.rowEditMode = false;
    this.fieldArray.push(this.newAttribute)
    console.log(JSON.stringify(this.fieldArray));
    console.log(this.fieldArray);
    this.newAttribute = {};
    // lineNumber.reset();
    // description.reset();
    // proQuan.reset();
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

  fetchActivities(cb) {

    // fetch('http://C3-0467:8011/api/Values/GetAllActivity')
    fetch('./assets/data/activities.json')
      .then(res => res.json())
      .then(data => cb(data))
      .catch(err => console.log(err));


    // const req = new XMLHttpRequest;
    // req.open('GET', 'http://C3-0467:8011/api/Values/GetAllActivity', true);

    // req.onload = () => {
    //   if (req.status === 200) {
    //     cb(JSON.parse(req.response));
    //   }
    // }
    // req.send();
  }

  fetchResources(cb) {

    fetch('http://C3-0467:8011/api/Values/GetAllResource')
      .then(res => res.json())
      .then(data => cb(data))
      .catch(err => console.log(err));

    // const req = new XMLHttpRequest;
    // req.open('GET', 'http://C3-0467:8011/api/Values/GetAllResource', true);

    // req.onload = () => {
    //   if (req.status === 200) {
    //     cb(JSON.parse(req.response));
    //   }
    // }
    // req.send();
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