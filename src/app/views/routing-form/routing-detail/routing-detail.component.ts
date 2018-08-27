import { FocusDirective } from './../../../common/Directives/focus.directive';
import { config } from './../../../models/config';
import { Component, OnDestroy, Input, ElementRef, ViewChild, EventEmitter, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { SubjectService } from '../../../services/subject.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { PricingService } from '../../../services/pricing/pricing.service';
import { ToastsManager, Toast } from '../../../../../node_modules/ng2-toastr';

@Component({
  selector: 'routing-detail',
  templateUrl: './routing-detail.component.html',
  styleUrls: ['./routing-detail.component.scss']
})

export class RoutingDetailComponent implements OnDestroy {
  masterFormData: any;
  operations: any;
  @Input() masterForm: any; 
  @ViewChildren(FocusDirective) vc:QueryList<FocusDirective>; 
//  @ViewChild("inputBox") _el: ElementRef;

  // ErrorMessage : string;
  IsDisable : boolean;  
  currentRow:number;
  
  IsValid : boolean;
  
  private fieldArray: Array<any> = [{LINE_NO: '',
    OPRN_ID: '',
    ROUTING_ID: '',
    OPRN_NO : '',
    OPRN_NAME : '',
    OPRN_VERS : '',
    disabled: true,
    rowEditMode: true}];
    bsModalRef: BsModalRef;
  
    message: any;
   
  constructor(private modalService: BsModalService,public toastr: ToastsManager, vcr: ViewContainerRef,
    private subService: SubjectService,private psService: PricingService
  ) {    
        
      this.IsDisable=true;
      this.IsValid=true;
      //operation LOV data
      this.subService.gridData.subscribe(                 
      lovData => {      
       
        let index : number 
        index = this.currentRow;     
        let objOperation =lovData.dataFromGrid;//.selected[0];
        if(objOperation === undefined)
        {
          this.toastr.warning('Invalid Routing Class.','', {dismiss: 'click'})
          .then((toast: Toast) => {
              setTimeout(() => {
                  this.toastr.dismissToast(toast);
              }, 3000);
          });
          this.fieldArray[index].OPRN_ID = '';
          this.fieldArray[index].OPRN_NO = '';
          this.fieldArray[index].OPRN_NAME = '';
          this.fieldArray[index].OPRN_VERS = '';
        }
        else{        
              this.fieldArray[index].OPRN_ID = objOperation.OPRN_ID;
              this.fieldArray[index].OPRN_NO = objOperation.OPRN_NO;
              this.fieldArray[index].OPRN_NAME = objOperation.OPRN_NAME;
              this.fieldArray[index].OPRN_VERS = objOperation.OPRN_VERS;
              //this._el.nativeElement.focus();
              
              if(lovData.focusRequired){
                 this.vc.forEach(x => x.setFocus('OPRN_NO'));
              }
            } 
      },
      error => console.log(error)
    );
      //end operation lov data

    // header data detail data
      this.subService.detailData.subscribe((data) => {
      
        const dtlData = data.detailData;
        this.masterFormData = dtlData;
        this.subService.RoutingData.next(
          { detailData : data  }
        );
        this.populateLineItems(dtlData);
      });
     ///end header detail data

     //get routing data by id
      this.subService.headerData.subscribe((data) => {
        //debugger
        this.masterFormData = data;
        if(data.dataFromGrid != undefined){
          const headerData = data.dataFromGrid.selected[0];
          
          if (headerData.ROUTING_ID) {
            this.psService.getDataByID('http://'+ config.hostaddress + `/api/Values/GetRoutingHeaderByID?id=${headerData.ROUTING_ID}`,'GET',headerData.ROUTING_ID).subscribe(          
            (res) => this.subService.detailData.next({             
                detailData: res 
              }),
              err => console.log(err)
            );          
          }
        }
      });
    
         //end get routing data by id    
    }

  ngOnInit() {
    
    this.subService.EnableDisableInput.subscribe(
      res => {       
              this.IsDisable = res.val;
              if(res.IsReset)
                this.fieldArray= [{LINE_NO: '',
                OPRN_ID: '',
                ROUTING_ID: '',
                OPRN_NO : '',
                OPRN_NAME : '',
                OPRN_VERS : '',
               // ROUTING_OPRN_ID : '',
                rowEditMode: true}]; 
        },
        error => console.log(error)
      );                   
      
    }

  openModalLOVGrid(index) {
   
    this.currentRow = index;
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

  getOperationDetail(index) {
  
    this.currentRow = index;
    if(this.fieldArray[index].OPRN_NO !=""){
        let url:string;
        url = 'http://'+ config.hostaddress + '/api/Values/GetOperationLOV', 
        this.psService.getData(url,'GET').subscribe(
          (res: any) => {
           
            const result = res.find(res => res.OPRN_NO.trim() === this.fieldArray[index].OPRN_NO.toUpperCase().trim());    
            this.subService.gridData.next({     
              dataFromGrid : result,
              focusRequired : false
            });      
          },
          err => console.log(err)  
        );
      }
      else
      {
        this.fieldArray[index].OPRN_ID = '';
        this.fieldArray[index].OPRN_NO = '';
        this.fieldArray[index].OPRN_NAME = '';
        this.fieldArray[index].OPRN_VERS = '';
      }
    }

  ngOnDestroy() {
    this.subService.headerData.unsubscribe();
    this.subService.EnableDisableInput.unsubscribe();
    this.subService.detailData.unsubscribe();
    this.subService.gridData.unsubscribe();   
    
  }

  populateLineItems(routingData) {
    //debugger
    this.fieldArray = [];
    const lineItems = routingData.Detail;

    lineItems.forEach(
      (lineItem, index) => {
        //debugger
        const obj = {          
          LINE_NO: lineItem.LINE_NO,
          OPRN_ID: lineItem.OPRN_ID,
          ROUTING_ID: lineItem.ROUTING_ID,
          OPRN_NO : lineItem.OPRN_NO, 
          OPRN_NAME : lineItem.OPRN_NAME,
          OPRN_VERS : lineItem.OPRN_VERS,
        //  ROUTING_OPRN_ID : lineItem.ROUTING_OPRN_ID,
          disabled: true,
          rowEditMode: false
        }
        this.fieldArray.push(obj);
       // this.fieldArray[index].operation = this.operations[index];
      }
    );
  }

  editFieldValue(index) {    
    this.fieldArray[index].disabled = false;    
    this.fieldArray[index].OPRN_NAME.disabled = true;
    this.fieldArray[index].OPRN_VERS.disabled = true;
    this.fieldArray[index].rowEditMode = true;
  }

  setRowBehaviour(index){
   
   if(this.validateDuplicate(index)){
    if (this.fieldArray[index].OPRN_ID  != ''  && this.fieldArray[index].LINE_NO != '') 
      this.fieldArray[index].rowEditMode = true;
   }
  }

  addAfterEdit(index) {
     if(this.validateDuplicate(index))
     {
        if (this.fieldArray[index].OPRN_ID  != ''  && this.fieldArray[index].LINE_NO != ''){
          this.fieldArray.push({LINE_NO: '',
          OPRN_ID: '',
          ROUTING_ID: '',
          OPRN_NO : '',
          OPRN_NAME : '',
          OPRN_VERS : '',
        // ROUTING_OPRN_ID : '',
          disabled: true,
          rowEditMode: true});

          this.fieldArray[index].disabled = true;
          this.fieldArray[index].rowEditMode = false;
        }
     }
  }

  validateDuplicate(index) : boolean{   
   // debugger
    if (this.fieldArray.length>1)
    {
      for (let i = 0; i < this.fieldArray.length-1; i++) {
        if(this.fieldArray[i].LINE_NO === this.fieldArray[index].LINE_NO)
        {
        
          this.toastr.warning("LINE_NO already exist.",'', {dismiss: 'click'})
          .then((toast: Toast) => {
              setTimeout(() => {
                  this.toastr.dismissToast(toast);
              }, 3000);
          });
         // this.vc.forEach(x => x.setFocus('LINE_NO'));
          return false;
        }
        else if(this.fieldArray[i].OPRN_NO === this.fieldArray[index].OPRN_NO)
        {
        
          this.toastr.warning("Operation already exist.",'', {dismiss: 'click'})
          .then((toast: Toast) => {
              setTimeout(() => {
                  this.toastr.dismissToast(toast);
              }, 3000);
          });         
          return false;
        }
        
      }     
    }
    return true;
  }

  deleteFieldValue(index) {
    if(this.fieldArray.length>1){
      this.fieldArray.splice(index, 1);
    }
  }

  fetchOperations(cb) {

    fetch('http://'+ config.hostaddress + '/api/Values/GetOperationLOV')
      .then(res => res.json())
      .then(data => cb(data))
      .catch(err => console.log(err));
  }



saveData() {

console.log(this.masterForm);
if(this.fieldArray[0].OPRN_ID=="" && this.fieldArray[0].LINE_NO=="")
{
  //this.ErrorMessage = "Please enter atleast one operation.";
  this.subService.message.next(
    { message : "Please enter atleast one operation."  }
  );
  this.IsValid=false;
}
else {
  this.IsValid=true;
}

      if (this.masterForm.valid && this.IsValid)
      {
          const obj = {
            ROUTING_ID: this.masterForm.value.ROUTING_ID === undefined ? "" : this.masterForm.value.ROUTING_ID,
            ROUTING_NO: this.masterForm.value.ROUTING_NO === undefined ? "" : this.masterForm.value.ROUTING_NO,
            ROUTING_VERS: this.masterForm.controls.ROUTING_VERS.value === undefined ? "" :this.masterForm.controls.ROUTING_VERS.value,
            ROUTING_STATUS: this.masterForm.value.ROUTING_STATUS === undefined ? "" :this.masterForm.value.ROUTING_STATUS,
            ROUTING_NAME: this.masterForm.value.ROUTING_NAME === undefined ? "" :this.masterForm.value.ROUTING_NAME,
            ROUTING_CLASS_ID: this.masterForm.value.ROUTING_CLASS_ID === undefined ? "" :this.masterForm.value.ROUTING_CLASS_ID,
            LAST_UPDATED_BY: '',
            LAST_UPDATE_DATE: '',
            ORGANIZATION_ID: '1947',      
            MFG_ROUTING_DETAIL: []
          }

          this.fieldArray.forEach(el => {
            if(el.OPRN_ID != "" && el.LINE_NO !=""){
                obj.MFG_ROUTING_DETAIL.push(
                  {
                    ROUTING_ID : this.masterForm.value.ROUTING_ID === undefined ? "" : this.masterForm.value.ROUTING_ID ,
                    OPRN_ID: el.OPRN_ID,
                    LINE_NO: el.LINE_NO,
                  // ROUTING_OPRN_ID : el.ROUTING_OPRN_ID,
                    CREATED_BY: '2',
                    //CREATED_DATE: new Date(),
                    ORGANIZATION_ID: '1947'
                  }
                )
              }
          });

          // console.log(obj);
         
          const req = new XMLHttpRequest();
          req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveRoutingData', true);
          req.setRequestHeader('Content-type', 'application/json');

          req.onreadystatechange = () => {//Call a function when the state changes.
            if (req.readyState == 4 && req.status == 200) {             
               //alert(req.responseText);
               this.setMessage(req.responseText);
            }
          } 
          req.send(JSON.stringify(obj));                
    }
    else{

    }
  }

   setMessage(status)
   {
     if(status.replace(/"/g,"") === '1' || status.replace(/"/g,"") == '2')
     {
       this.toastr.success("Record saved successfully.",'', {dismiss: 'click'})
           .then((toast: Toast) => { setTimeout(() => { this.toastr.dismissToast(toast); }, 3000);
         });         
     }
   }

 }