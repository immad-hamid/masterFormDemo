
import { config } from './../../../models/config';
import { Component, OnDestroy } from '@angular/core';
import { SubjectService } from '../../../services/subject.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { OPERATION } from '../../../models/operation.model';
import { PricingService } from '../../../services/pricing/pricing.service';

@Component({
  selector: 'routing-detail',
  templateUrl: './routing-detail.component.html',
  styleUrls: ['./routing-detail.component.scss']
})

export class RoutingDetailComponent implements OnDestroy {
  masterFormData: any;
  operations: any;
  resources: any;
  activityEl: any;
  dtoSave: any;

  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService,
    private subService: SubjectService,private psService: PricingService
  ) {    

    this.subService.gridData.subscribe(      
      lovData => {              
        let objOperation =lovData.dataFromGrid.selected[0];
        this.newAttribute.OPRN_ID = objOperation.OPRN_ID;
        this.newAttribute.OPRN_NO = objOperation.OPRN_NO;
        this.newAttribute.OPRN_NAME = objOperation.OPRN_NAME;
        this.newAttribute.OPRN_VERS = objOperation.OPRN_VERS;
      });
    // header data
    this.subService.headerData.subscribe((data) => {
      this.masterFormData = data;
    });
    // operation data
    this.subService.operationData.subscribe((data) => {
      const opData = data.operationData;
      this.populateLineItems(opData);
    });
  }

  ngOnInit() {   
    
  }

  openModalLOVGrid() {
    const initialState = {
      list: [
        'This Modal will show the Operation LOV...'
      ],
      columns: [        
        { prop: 'OPRN_NO', name: 'OPRN_NO' },
        { prop: 'OPRN_VERS', name: 'OPRN_VERS' },
        { prop: 'OPRN_NAME', name: 'OPRN_NAME' }
      ],
      url: 'http://'+ config.hostaddress + '/api/Values/GetOperationLOV',      
      name : 'OPERATION'
    };
    
    this.bsModalRef = this.modalService.show(
      CommonGridComponent, { initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  ngOnDestroy() {
    this.subService.headerData.unsubscribe();
  }

  onInput(event) {
    console.dir(event.target.value);
  }

  populateLineItems(opData) {
    this.fieldArray = [];
    const lineItems = opData.MFG_OPERATION_DETAILS;

    lineItems.forEach(
      (lineItem, index) => {
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

        this.fieldArray[index].operation = this.operations[index];
      }
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
    this.fieldArray[index].OPRN_NAME.disabled = true;
    this.fieldArray[index].OPRN_VERS.disabled = true;
    this.fieldArray[index].rowEditMode = true;
  }

  addAfterEdit(index) {
    this.fieldArray[index].disabled = true;
    this.fieldArray[index].rowEditMode = false;
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  fetchOperations(cb) {

    fetch('http://C3-0467:8011/api/Values/GetOperationLOV')
      .then(res => res.json())
      .then(data => cb(data))
      .catch(err => console.log(err));
  }

  saveData() {

    // foreach (var item in model.MFG_ROUTING_DETAIL)
    // {
    //     Detail = new MFG_ROUTING_DETAIL();
    //     Detail.ROUTING_ID = header.ROUTING_ID;
    //     Detail.OPRN_ID = item.OPRN_ID;
    //     Detail.LINE_NO = item.LINE_NO;
    //     Detail.CREATED_BY = Convert.ToInt32(HttpContext.Current.Session["Userno"]);
    //     Detail.CREATION_DATE = DateTime.Now;
    //     Detail.ORGANIZATION_ID = 1947;
    //     db.MFG_ROUTING_DETAIL.Add(Detail);
    // }

debugger
    const obj = {
      ROUTING_ID: this.masterFormData.ROUTING_ID === undefined ? "" : this.masterFormData.ROUTING_ID.value,
      ROUTING_NO: this.masterFormData.ROUTING_NO === undefined ? "" : this.masterFormData.ROUTING_NO.value,
      ROUTING_VERS: this.masterFormData.ROUTING_VERS === undefined ? "" :this.masterFormData.ROUTING_VERS.value,
      ROUTING_STATUS: this.masterFormData.ROUTING_STATUS === undefined ? "" :this.masterFormData.ROUTING_STATUS.value.value,
      ROUTING_NAME: this.masterFormData.ROUTING_NAME === undefined ? "" :this.masterFormData.ROUTING_NAME.value,
      ROUTING_CLASS_ID: this.masterFormData.ROUTING_CLASS_ID === undefined ? "" :this.masterFormData.ROUTING_CLASS_ID.value,
      LAST_UPDATED_BY: '',
      LAST_UPDATE_DATE: '',
      ORGANIZATION_ID: '1947',      
      MFG_ROUTING_DETAIL: []
    }

    this.fieldArray.forEach(el => {
      
      obj.MFG_ROUTING_DETAIL.push(
        {
          ROUTING_ID : this.masterFormData.ROUTING_ID === undefined ? "" : this.masterFormData.ROUTING_ID.value ,
          OPRN_ID: el.OPRN_ID,
          LINE_NO: el.LINE_NO,
          CREATED_BY: '2',
          //CREATED_DATE: new Date(),
          ORGANIZATION_ID: '1947'
        }
      )
    });
    debugger
   // console.log(obj);

    const req = new XMLHttpRequest();
    req.open('POST','http://localhost:55690/api/Values/SaveRoutingData', true);
    req.setRequestHeader('Content-type', 'application/json');

    req.onreadystatechange = function () {//Call a function when the state changes.
      if (req.readyState == 4 && req.status == 200) {
        debugger
       // alert(JSON.parse(req.responseText));
        //console.log(JSON.stringify(obj));
        // alert(req.responseText);
      }
    }

    req.send(JSON.stringify(obj));
  }

  checkVal(val) {
    console.log(val);
  }
}