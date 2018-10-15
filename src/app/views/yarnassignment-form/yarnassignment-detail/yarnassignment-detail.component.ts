import { PricingService } from './../../../services/pricing/pricing.service';
import { SubjectService } from './../../../services/subject.service';
import { ToastsManager,Toast } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'yarnassignment-detail',
  templateUrl: './yarnassignment-detail.component.html',
  styleUrls: ['./yarnassignment-detail.component.scss']
})
export class YarnassignmentDetailComponent implements OnInit {
  @Input() masterForm: any; 
  @Input() loader: boolean; 
  masterFormData: any;
  IsDisable : boolean;    
  IsValid : boolean;
  message: any;
  
  private fieldArray: Array<any> = [{SIZING_YARN_DETAIL_ID: '',
  YARN_SNO: '',
  YARN_DESC: '',
  COUNT : '',
  PERCENT_YARN_WT : '',
  NO_ENDS_QVR : '',
  NO_OF_ENDS_ACTUAL : '',
  REQUIRED_WEIGHT_ACTUAL : '',
  REQUIRED_LENGTH_QVR : '',   
    disabled: true,
    rowEditMode: true
    }];

  constructor(private modalService: BsModalService,public toastr: ToastsManager, vcr: ViewContainerRef,
    private subService: SubjectService,private psService: PricingService) { this.IsDisable=true;
      this.IsValid=true;
      this.subService.detailData.subscribe((data) => {
        // debugger             
         const dtlData = data.detailData;  
         this.PopulateYarnDetails(dtlData);  
              
       });
      }

      PopulateYarnDetails(dtldata){
        debugger
        
        console.log(this.loader);
        this.fieldArray = [];       
        const lineItems = dtldata;
        
        lineItems.forEach(
          (lineItem, index) => {
             debugger            
                const obj = {          
                  SIZING_YARN_DETAIL_ID: lineItem.SIZING_YARN_DETAIL_ID,
                  YARN_SNO: lineItem.YARN_SNO,
                  YARN_CODE: lineItem.YARN_CODE,
                  YARN_DESC : lineItem.YARN_DESC, 
                  COUNT : lineItem.COUNT,
                  YARN_WEIGHT_PERCENTAGE : lineItem.YARN_WEIGHT_PERCENTAGE,
                  NO_OF_ENDS : lineItem.NO_OF_ENDS,
                  NO_OF_ENDS_ACTUAL: lineItem.NO_OF_ENDS_ACTUAL,
                  REQUIRED_WEIGHT_ACTUAL: lineItem.REQUIRED_WEIGHT_ACTUAL,                
                }
                //debugger
                this.fieldArray.push(obj);
                         
                // if(index == lineItems.length-1)
                //   this.fieldArray[index].rowEditMode = true;
              
              }
        );   
      }


  ngOnInit() { this.subService.EnableDisableInput.subscribe(
    res => {       
            this.IsDisable = res.val;
            if(res.IsReset)
              this.fieldArray= [{SIZING_YARN_DETAIL_ID: '',
              YARN_SNO: '',
              YARN_DESC: '',
              COUNT : '',
              PERCENT_YARN_WT : '',
              NO_ENDS_QVR : '',
              NO_OF_ENDS_ACTUAL : '',
              REQUIRED_WEIGHT_ACTUAL : '',
              REQUIRED_LENGTH_QVR : '',   
                disabled: true,
                rowEditMode: true }];              
      },
      error => console.log(error)
    );                       
  }

  ngOnDestroy() {
    this.subService.detailData.unsubscribe();      
    this.subService.EnableDisableInput.unsubscribe();
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
