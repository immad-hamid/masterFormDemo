import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { config } from '../../../models/config';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager, Toast } from 'ng2-toastr';
import { PricingService } from '../../../services/pricing/pricing.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubjectService } from '../../../services/subject.service';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { DatePipe } from '@angular/common';
import { SizingprogramDetailComponent } from '../sizingprogram-detail/sizingprogram-detail.component';

@Component({
  selector: 'sizingprogram-header',
  templateUrl: './sizingprogram-header.component.html',
  styleUrls: ['./sizingprogram-header.component.scss']
})
export class SizingprogramHeaderComponent implements OnInit {
  masterForm;
  editMode: boolean;
  status :{value:number,name:string}[] ;
  loaderVal: boolean;
  
  private WeaverArray: Array<any> = [{WEAVER_CODE: '',
    WEAVER_NAME: ''}];
  // private QualityArray: Array<any> = [{QUALITY_SNO: '',
  //   QUALITY_CODE: ''}];
  // private POArray: Array<any> = [{RECORD_ID: '',
  //   PO_NO: ''}];
    
// private search_params = {QUALITY_CODE : "" , WEAVER_CODE : "" , PO_NO : ""};

  bsModalRef: BsModalRef;
  toastrService: any;
  constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef ,private datePipe: DatePipe) { 
      this.toastr.setRootViewContainerRef(vcr);
      this.getWeaver();
     
   // this.getQuality();
   // this.getPO();
    
   this.subService.EntityData.subscribe((data) => {      
    
    const obj = data.dataFromGrid.selected[0];  
        this.SIZING_PROGRAM_HEADER_ID.setValue(obj.SIZING_PROGRAM_HEADER_ID);        
        this.CREATED_DATE.setValue(this.datePipe.transform(obj.CREATED_DATE, "dd-MM-yyyy"));
        this.STATUS.setValue(obj.STATUSID);        
        this.GetDetail(obj.SIZING_PROGRAM_HEADER_ID);    
        
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

  GetDetail(header_id)
  {
    let url:string;
    url = `http://${config.hostaddress}/api/Values/GetSizingProgramByID?id=${header_id}`, 
    this.psService.getData(url,'GET').subscribe(
      (res: any) => {           
       //debugger
        this.subService.detailData.next(
          { detailData : res  }
        );
     },
     err => console.log(err)  
   );      
  }

  ngOnInit() {
    this.status = [
      {
        value: 1,
        name: "Pending"
      },
      {
        value: 2,
        name: "Completed"
      },  
    ];    
    
    var date = new Date();
    let curr_date = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() ;
    
    this.masterForm = this.fb.group({
      SIZING_PROGRAM_HEADER_ID: [],      
      STATUS: [1, Validators.required],
      CREATED_DATE: [{value:curr_date, disabled: true}],
      WEAVER_CODE : [149],
      PO_NO : [],
      QUALITY_CODE: ['N1936BF6T'],
    });

    this.disableInputs();
  }

  getWeaver() {
   
        let url:string;
        url = 'http://'+ config.hostaddress + '/api/Values/GetAllWeaver', 
        this.psService.getData(url,'GET').subscribe(
          (res: any) => {
            
            this.WeaverArray  = res;               
            this.WeaverArray.unshift({WEAVER_CODE: '0',
            WEAVER_NAME: 'Select weaver.'});
          },
          err => console.log(err)  
        );
      
      }

      ngOnDestroy() {
        this.subService.EntityData.unsubscribe();      
        this.subService.message.unsubscribe();
      }
      // getQuality() {
   
      //   let url:string;
      //   url = 'http://'+ config.hostaddress + '/api/Values/GetQualities', 
      //   this.psService.getData(url,'GET').subscribe(
      //     (res: any) => {
      //       this.QualityArray = res;
      //       this.QualityArray.unshift({QUALITY_SNO: '0',
      //       QUALITY_CODE: 'Select quality.'});
      //       // const result = res.find(res => res.ROUTING_CLASS === this.ROUTING_CLASS.value.toUpperCase());    
      //       // this.subService.RoutingClassData.next({     
      //       //   dataFromGrid : result
      //       // });      
      //     },
      //     err => console.log(err)  
      //   );
      // }

      // getPO() {
          
      //   let url:string;
      //   url = 'http://'+ config.hostaddress + '/api/Values/GetPO', 
      //   this.psService.getData(url,'GET').subscribe(
      //     (res: any) => {
      //       this.POArray = res;
      //       this.POArray.unshift({RECORD_ID: '0',
      //       PO_NO: 'Select PO.'});
      //       // const result = res.find(res => res.ROUTING_CLASS === this.ROUTING_CLASS.value.toUpperCase());    
      //       // this.subService.RoutingClassData.next({     
      //       //   dataFromGrid : result
      //       // });      
      //     },
      //     err => console.log(err)  
      //   );
      // }

      GetPODetail()
      {
        debugger
        this.loaderVal = true;
        let PODetail ;
        this.psService.getData(`http://${config.hostaddress}/api/Values/GetPODetail?WeaverCode=${this.WEAVER_CODE.value}&PoNo=${this.PO_NO.value}&QualityCode=${this.QUALITY_CODE.value}`,'GET').subscribe(          
          (res) => {
          debugger
          this.loaderVal = false;
          
           PODetail = res;
            if(PODetail.length>0){
              this.subService.detailData.next({             
                detailData: PODetail 
              })
            }
            else
              { this.toastr.warning('No records found.','', {dismiss: 'click'})
              .then((toast: Toast) => {
                  setTimeout(() => {
                      this.toastr.dismissToast(toast);
                  }, 3000);
              });         }
          },
          err => console.log(err)
          ); 
      }
      
      openModalSearchGrid() {  
        const initialState = {
          list: [
            'This Modal will show the Data Grid...'
          ],
          columns: [
            { prop: 'SIZING_PROGRAM_HEADER_ID', name: 'PROGRAM NO' },
            { prop: 'WEAVER_NAME', name: 'WEAVER' },
            { prop: 'PO_NO', name: 'PO NO' },
            { prop: 'QUALITY_CODE', name: 'QUALITY CODE' },
            { prop: 'NO_OF_PANEL', name: 'NO OF PANELS' },            
            { prop: 'REQUIRED_WEIGHT', name: 'REQ. WEIGHT' },
            { prop: 'STATUS', name: 'STATUS' },       
          ],
          url: 'http://'+ config.hostaddress + '/api/Values/GetListSizingProgram',
          HttpType : 'POST',
          name : "SIZING_PROGRAM"
        };
        this.bsModalRef = this.modalService.show(
          CommonGridComponent, { initialState }
        );
        this.bsModalRef.content.closeBtnName = 'Close';
      }


      clearInputs()
      {
        //this.masterForm.reset();
        this.STATUS.setValue(1);
        this.CREATED_DATE.setValue(this.psService.getCurrDate());
      } 

      addRecord(){
        this.enableInputs();
        this.clearInputs();
      }

      // enabling inputs
 enableInputs() {
  this.editMode = true; 
  this.STATUS.enable(); 
  this.WEAVER_CODE.enable(); 
  this.QUALITY_CODE.enable(); 
  this.PO_NO.enable();
  this.subService.EnableDisableInput.next(
    { val: false,
      IsReset : false
     }
  );
}

// disabling inputs
disableInputs() {
  this.editMode = false; 
  this.STATUS.disable(); 
  this.WEAVER_CODE.disable(); 
  this.QUALITY_CODE.disable(); 
  this.PO_NO.disable();
  this.subService.EnableDisableInput.next(
    { val: true,
      IsReset : true 
    }
  );
 this.clearInputs();
} 

      get SIZING_PROGRAM_HEADER_ID() { return this.masterForm.get('SIZING_PROGRAM_HEADER_ID') }
      get CREATED_DATE() { return this.masterForm.get('CREATED_DATE') }
      get WEAVER_CODE() { return this.masterForm.get('WEAVER_CODE') }
      get QUALITY_CODE() { return this.masterForm.get('QUALITY_CODE') }
      get PO_NO() { return this.masterForm.get('PO_NO') }
      get STATUS() { return this.masterForm.get('STATUS') }
     
}



