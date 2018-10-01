import { config } from './../../../models/config';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager, Toast } from 'ng2-toastr';
import { PricingService } from './../../../services/pricing/pricing.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubjectService } from './../../../services/subject.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BsModalService } from '../../../../../node_modules/ngx-bootstrap/modal/bs-modal.service';

@Component({
  selector: 'sizingprogram-header',
  templateUrl: './sizingprogram-header.component.html',
  styleUrls: ['./sizingprogram-header.component.scss']
})
export class SizingprogramHeaderComponent implements OnInit {
  masterForm;
  editMode: boolean;
  status :{value:number,name:string}[] ;

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
    private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef) { 

      this.getWeaver();
   // this.getQuality();
   // this.getPO();
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
    
    var date = new Date();
    let curr_date = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() ;
    
    this.masterForm = this.fb.group({
      SIZING_PROGRAM_HEADER_ID: [],      
      STATUS: [1, Validators.required],
      CREATED_DATE: [{value:curr_date, disabled: true}],
      WEAVER_CODE : [],
      PO_NO : [],
      QUALITY_CODE: [],
    });
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

        let PODetail ;
        this.psService.getData(`http://${config.hostaddress}/api/Values/GetPODetail?WeaverCode=${this.WEAVER_CODE.value}&PoNo=${this.PO_NO.value}&QualityCode=${this.QUALITY_CODE.value}`,'GET').subscribe(          
          (res) => {
         //  debugger
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
      
      get SIZING_PROGRAM_HEADER_ID() { return this.masterForm.get('SIZING_PROGRAM_HEADER_ID') }
      get CREATED_DATE() { return this.masterForm.get('CREATED_DATE') }
      get WEAVER_CODE() { return this.masterForm.get('WEAVER_CODE') }
      get QUALITY_CODE() { return this.masterForm.get('QUALITY_CODE') }
      get PO_NO() { return this.masterForm.get('PO_NO') }
      get STATUS() { return this.masterForm.get('STATUS') }
     
}



