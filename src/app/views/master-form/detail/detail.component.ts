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

  onInput(event) {
    console.dir(event.target.value);
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
      },

      console.log(this.fieldArray),
      console.log(this.activities),
      console.log(this.masterFormData)
    );
  }

  // adding activity description
  addActivityDesc(select: any, index?: number) {
    console.log(index);
    if (index !== undefined) {
      console.log('Not undefined');
      this.fieldArray[index].description = select.value.ACTIVITY_NAME
    } else {
      this.newAttribute.description = select.value.ACTIVITY_NAME
    }
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

    fetch('http://C3-0467:8011/api/Values/GetAllActivity')
      .then(res => res.json())
      .then(data => cb(data))
      .catch(err => console.log(err));
  }

  fetchResources(cb) {

    fetch('http://C3-0467:8011/api/Values/GetAllResource')
      .then(res => res.json())
      .then(data => cb(data))
      .catch(err => console.log(err));
  }

  saveData() {
    const obj = {
      status: '2',
      ACTIVITY: '',
      RESOURCE: '',
      OPRN_ID: this.masterFormData.operation !== "" ? this.masterFormData.operation : null,
      OPRN_NO: '',
      OPRN_VERS: '2',
      OPRN_NAME: this.masterFormData.operationName,
      OPERATION_STATUS: this.masterFormData.status,
      OPRN_CLASS_ID: this.masterFormData.class,
      OPRN_CLASS: '',
      OPRN_CLASS_NAME: '',
      ORGANIZATION_ID: '1947',
      MFG_OPERATION_DETAILS: []
    }

    this.fieldArray.forEach(el => {
      obj.MFG_OPERATION_DETAILS.push(
        {
          OPRN_ACT_RES_ID: 0,
          OPRN_ACT_ID: 190,
          RESOURCE_ID: el.resources.RESOURCE_ID,
          LINE_NO: el.lineNum,
          OPRN_ID: 1781,
          ACTIVITY_ID: el.activities.ACTIVITY_ID,
          ACTIVITY: el.activities.ACTIVITY,
          ACTIVITY_NAME: el.activities.ACTIVITY,
          RESOURCE: 158,
          RESOURCE_NAME: null,
          RESOURCE_USAGE: '2017-07-01T00:00:00',
          USAGE_UM: null,
          PROCESS_QTY: el.proQuan,
          PROCESS_UOM: ''
        }
      )
    });

    console.log(JSON.stringify(obj));

    const req = new XMLHttpRequest();
    req.open('POST', `http://C3-0467:8011/api/Values/Save`, true);
    req.setRequestHeader('Content-type', 'application/json');

    req.onreadystatechange = function () {//Call a function when the state changes.
      if (req.readyState == 4 && req.status == 200) {
        alert(JSON.parse(req.responseText));
        console.log(JSON.stringify(obj));
        // alert(req.responseText);
      }
    }

    req.send(JSON.stringify(obj));
  }

  checkVal(val) {
    console.log(val);
  }
}