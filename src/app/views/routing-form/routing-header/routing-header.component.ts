import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { SubjectService } from '../../../services/subject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { config } from '../../../models/config';
import { PricingService } from '../../../services/pricing/pricing.service';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'routing-header',
  templateUrl: './routing-header.component.html',
  styleUrls: ['./routing-header.component.scss']
})
export class RoutingHeaderComponent implements OnInit, OnDestroy {
  masterForm;
  editMode: boolean;
  status :{value:number,name:string}[] ;
  bsModalRef: BsModalRef;
  toastrService: any;
  
  constructor(private modalService: BsModalService,
     private subService: SubjectService,
     public fb: FormBuilder,
     private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef
    ) { 
    this.toastr.setRootViewContainerRef(vcr);

    this.subService.RoutingClassData.subscribe(
      lovData => {
        if(lovData.dataFromGrid === undefined)
        {
          this.toastr.warning('Invalid Routing Class.','', {dismiss: 'click'})
          .then((toast: Toast) => {
              setTimeout(() => {
                  this.toastr.dismissToast(toast);
              }, 3000);
          });
          this.ROUTING_CLASS_ID.setValue('');
          this.ROUTING_CLASS.setValue('');
          this.ROUTING_CLASS_NAME.setValue('');
        }
        else{
            const objRouting = lovData.dataFromGrid;       
        //  if(objRouting.ROUTING_CLASS_ID > 0){
            this.ROUTING_CLASS_ID.setValue(objRouting.ROUTING_CLASS_ID);
            this.ROUTING_CLASS.setValue(objRouting.ROUTING_CLASS);
            this.ROUTING_CLASS_NAME.setValue(objRouting.ROUTING_CLASS_NAME);
        // }
      }
});
      
      this.subService.RoutingData.subscribe((data) => {     
        const obj = data.detailData.detailData;        
        this.ROUTING_CLASS_ID.setValue(obj.ROUTING_CLASS_ID);
        this.ROUTING_CLASS.setValue(obj.ROUTING_CLASS);
        this.ROUTING_CLASS_NAME.setValue(obj.ROUTING_CLASS_NAME);        
        this.ROUTING_VERS.setValue(obj.ROUTING_VERS);
        this.ROUTING_STATUS.setValue(obj.ROUTING_STATUS);
        this.ROUTING_NO.setValue(obj.ROUTING_NO);
        this.ROUTING_NAME.setValue(obj.ROUTING_NAME);
        this.ROUTING_ID.setValue(obj.ROUTING_ID);        
      });           
   
      this.subService.message.subscribe((data) => {    
                  
         this.toastr.warning(data.message,'', {dismiss: 'click'})
         .then((toast: Toast) => {
             setTimeout(() => {
                 this.toastr.dismissToast(toast);
             }, 3000);
         });
        //  showSuccess() {
        //   this.toastr.success('You are awesome!', 'Success!');
        // }      
        // showError() {
        //   this.toastr.error('This is not good!', 'Oops!');
        // }      
        // showWarning() {
        //   this.toastr.warning('You are being warned.', 'Alert!');
        // }      
        // showInfo() {
        //   this.toastr.info('Just some information for you.');
        // }        
        // showCustom() {
        //   this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
        // }
       });        
      
    }


  ngOnInit() {

            this.status = [
              {
                value: 1,
                name: "Pending"
              },
              {
                value: 2,
                name: "Sent for Approval"
              },
              {
                value: 3,
                name: "Approved"
              },
              {
                value: 4,
                name: "Cancel"
              }
            ];

            this.masterForm = this.fb.group({
              ROUTING_CLASS_ID: [{value:null}],
              ROUTING_CLASS: [null, Validators.required],
              ROUTING_CLASS_NAME: [{value:null, disabled: true}],
              ROUTING_NO : [null,Validators.required],
              ROUTING_ID : [{value: null}],
              ROUTING_STATUS: [{value: 1}],
              ROUTING_VERS : [{value: '1', disabled: true}],
              ROUTING_NAME:[null,Validators.required]
            });


            this.subService.headerData.next({       
              ROUTING_CLASS_ID: this.ROUTING_CLASS_ID.value,
              ROUTING_CLASS: this.ROUTING_CLASS.value,
              ROUTING_CLASS_NAME: this.ROUTING_CLASS_NAME.value,
              ROUTING_NO : this.ROUTING_NO.value,
              ROUTING_ID : this.ROUTING_ID.value.value,
              ROUTING_STATUS: this.ROUTING_STATUS.value.value,
              ROUTING_VERS : this.ROUTING_VERS.value,
              ROUTING_NAME:this.ROUTING_NAME.value
            }); 

           
            this.disableInputs();
  }
  addRecord(){
    this.enableInputs();
    this.clearInputs();
  }


  getRoutingClassDetail() {
   
    if(this.ROUTING_CLASS.value !=""){
        let url:string;
        url = 'http://'+ config.hostaddress + '/api/Values/GetRoutingClassLOV', 
        this.psService.getData(url,'GET').subscribe(
          (res: any) => {
            
            const result = res.find(res => res.ROUTING_CLASS === this.ROUTING_CLASS.value.toUpperCase());    
            this.subService.RoutingClassData.next({     
              dataFromGrid : result
            });      
          },
          err => console.log(err)  
        );
      }
      else
      {
        this.ROUTING_CLASS.setValue('');
        this.ROUTING_CLASS_NAME.setValue('');
        this.ROUTING_CLASS_ID.setValue('');      
      }
    }
   
  getHeaderData() {    
     this.subService.headerData.next({
     ROUTING_CLASS_ID: this.ROUTING_CLASS_ID,
     ROUTING_CLASS: this.ROUTING_CLASS,
     ROUTING_CLASS_NAME: this.ROUTING_CLASS_NAME,
     ROUTING_NO : this.ROUTING_NO,
     ROUTING_ID : this.ROUTING_ID,
     ROUTING_STATUS: this.ROUTING_STATUS,
     ROUTING_VERS : this.ROUTING_VERS,
     ROUTING_NAME:this.ROUTING_NAME
     });
   }

  ngOnDestroy() {
    this.subService.gridData.unsubscribe(); 
    this.subService.RoutingClassData.unsubscribe(); 
    this.subService.RoutingData.unsubscribe();
  }

  openModalGrid() { 
    const initialState = {
      list: [
        'This Modal will show the Routing Class LOV...'
      ],
      columns: [
        { prop: 'ROUTING_CLASS_ID', name: 'ROUTING_CLASS_ID' },
        { prop: 'ROUTING_CLASS', name: 'ROUTING_CLASS' },
        { prop: 'ROUTING_CLASS_NAME', name: 'ROUTING_CLASS_NAME' }
      ],
      url: 'http://'+ config.hostaddress + '/api/Values/GetRoutingClassLOV',
      HttpType : 'GET',
      name : 'ROUTING_CLASS'
    };   
    this.bsModalRef = this.modalService.show(
      CommonGridComponent, { initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  openModalSearchGrid() {  
    const initialState = {
      list: [
        'This Modal will show the Data Grid...'
      ],
      columns: [
        { prop: 'ROUTING_NO', name: 'ROUTING_NO' },
        { prop: 'ROUTING_VERS', name: 'ROUTING_VERS' },
        { prop: 'ROUTING_CLASS', name: 'ROUTING_CLASS' },
        { prop: 'OPRN_NAME', name: 'OPRN_NAME' },
        { prop: 'status', name: 'status' },       
      ],
      url: 'http://'+ config.hostaddress + '/api/Values/GetListRouting',
      HttpType : 'POST',
      name : "ROUTING"
    };

    this.bsModalRef = this.modalService.show(
      CommonGridComponent, { initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

 // enabling inputs
 enableInputs() {
  this.editMode = true; 
  this.ROUTING_NO.enable(); 
  this.ROUTING_STATUS.enable(); 
  this.ROUTING_CLASS.enable(); 
  this.ROUTING_NAME.enable();
  this.subService.EnableDisableInput.next(
    { val: false,
      IsReset : false
     }
  );
}

// disabling inputs
disableInputs() {
  this.editMode = false; 
  this.ROUTING_NO.disable(); 
  this.ROUTING_STATUS.disable(); 
  this.ROUTING_CLASS.disable(); 
  this.ROUTING_NAME.disable();
  this.subService.EnableDisableInput.next(
    { val: true,
    IsReset : true 
    }
  );
 this.clearInputs();
} 

clearInputs()
{
  this.masterForm.reset();
  this.ROUTING_STATUS.setValue(1);
  this.ROUTING_VERS.setValue(1);
} 


getRoutingClass(){  
  
  if (this.ROUTING_CLASS_NAME !="") {
    this.psService.getDataByID('http://'+ config.hostaddress + `/api/Values/GetRoutingHeaderByID?id=${this.ROUTING_CLASS_NAME}`,'GET',this.ROUTING_CLASS_NAME).subscribe(          
    (res) => this.subService.RoutingClassData.next({             
      RoutingClassData: res 
      }),
      err => console.log(err)
    );          
  }
}

  get ROUTING_CLASS_ID() { return this.masterForm.get('ROUTING_CLASS_ID') }
  get ROUTING_CLASS() { return this.masterForm.get('ROUTING_CLASS') }
  get ROUTING_CLASS_NAME() { return this.masterForm.get('ROUTING_CLASS_NAME') }
  get ROUTING_ID() { return this.masterForm.get('ROUTING_ID') }
  get ROUTING_NO() { return this.masterForm.get('ROUTING_NO') }
  get ROUTING_NAME() { return this.masterForm.get('ROUTING_NAME') }
  get ROUTING_STATUS() { return this.masterForm.get('ROUTING_STATUS') }
  get ROUTING_VERS() { return this.masterForm.get('ROUTING_VERS') }

  ValidateDuplicate()
  {
   // debugger
      if (this.ROUTING_NO.value !="") {
      let url:string;
      url = 'http://'+ config.hostaddress + `/api/Values/KeyCheck?no=${this.ROUTING_NO.value}`, 
      this.psService.getData(url,'GET').subscribe(
        (res: any) => {
          if(res){
            this.subService.message.next(
              { message : "Already exist!" }
            );
            this.ROUTING_NO.setValue('');
          }
        },
        err => console.log(err)  
      );
     }
   } 

}
