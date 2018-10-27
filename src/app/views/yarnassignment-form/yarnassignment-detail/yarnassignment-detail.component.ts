import { config } from './../../../models/config';
import { PricingService } from './../../../services/pricing/pricing.service';
import { SubjectService } from './../../../services/subject.service';
import { ToastsManager,Toast } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { TooltipConfig } from '../../../../../node_modules/ngx-bootstrap';

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
  REQUIRED_WEIGHT_QVR : '',
  REQUIRED_LENGTH_QVR : '',   
  BEAM_TYPE_DETAIL_RECORD_ID : '',
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
         this.setTotalEnds();
       });
      }

      PopulateYarnDetails(dtldata){
        debugger
        if(dtldata.length>0){
          if(dtldata[0].SELECTED_WT != undefined)
          this.masterForm.get('SELECTED_WT').setValue( dtldata[0].SELECTED_WT);
          this.masterForm.get('SIZING_PROGRAM_HEADER_ID').setValue(dtldata[0].SIZING_PROGRAM_NO) ;
          this.masterForm.get('SIZING_YARN_HEADER_ID').setValue(dtldata[0].SIZING_YARN_HEADER_ID) ;
          this.masterForm.get('SIZING_PROGRAM_DETAIL_ID').setValue(dtldata[0].SIZING_PROGRAM_DETAIL_ID) ;           
        }
    
        const selected_wt = parseFloat(this.masterForm.controls.SELECTED_WT.value || 0);

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
                  REQUIRED_WEIGHT_ACTUAL: (((parseFloat(lineItem.YARN_WEIGHT_PERCENTAGE ||0) /100 *
                  selected_wt)/parseFloat(lineItem.NO_OF_ENDS || 1)) * parseFloat(lineItem.NO_OF_ENDS_ACTUAL || 0)).toFixed(2),//lineItem.REQUIRED_WEIGHT_ACTUAL,               
                  PLY: lineItem.PLY, 
                  REQUIRED_WEIGHT_QVR : (parseFloat(lineItem.YARN_WEIGHT_PERCENTAGE || 0 ) /100 *selected_wt).toFixed(3) ,
                  REQUIRED_LENGTH_QVR : ((((parseFloat(lineItem.YARN_WEIGHT_PERCENTAGE || 0 ) /100 * selected_wt)) * 2.2046 * 768 * (parseFloat(lineItem.COUNT || 0) / parseFloat(lineItem.PLY || 1))  ) /  parseFloat(lineItem.NO_OF_ENDS||1) ).toFixed(3) ,
                  BEAM_TYPE_DETAIL_RECORD_ID : lineItem.BEAM_TYPE_DETAIL_RECORD_ID
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
              YARN_CODE: '',
              YARN_SNO: '',
              YARN_DESC: '',
              COUNT : '',
              YARN_WEIGHT_PERCENTAGE:'',
              PERCENT_YARN_WT : '',
              NO_ENDS_QVR : '',
              NO_OF_ENDS_ACTUAL : '',
              REQUIRED_WEIGHT_ACTUAL : '',
              REQUIRED_WEIGHT_QVR : '',
              REQUIRED_LENGTH_QVR : '',  
              BEAM_TYPE_DETAIL_RECORD_ID : '',
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

  save(){  
   // debugger
      let isExist : boolean = false;
      this.IsValid=true;
    
      this.fieldArray.forEach(el => {
        if(el.NO_OF_ENDS_ACTUAL != "" && el.NO_OF_ENDS_ACTUAL != undefined && el.NO_OF_ENDS_ACTUAL){
          isExist = true;
        }
      })

      if(!isExist)
      {  this.subService.message.next(
          { message : "Please enter No. of Ends in atleast one line." }
        );
        this.IsValid=false;
      }

      if (this.masterForm.valid && this.IsValid)
      {
          const obj = {            
            SIZING_YARN_HEADER_ID: (this.masterForm.value.SIZING_YARN_HEADER_ID || 0),
            SIZING_PROGRAM_DETAIL_ID: (this.masterForm.value.SIZING_PROGRAM_DETAIL_ID || 0),
            BEAM_TYPE: this.masterForm.value.BEAM_TYPE === undefined ? "" : this.masterForm.value.BEAM_TYPE,
            NO_OF_ENDS: this.masterForm.value.NO_OF_ENDS === undefined ? "" : this.masterForm.value.NO_OF_ENDS,
            ORGANIZATION_ID: '1948',      
            WSZ_SIZING_YARN_DETAIL_VIEW: []
      }

          this.fieldArray.forEach(el => {
            if(el.NO_OF_ENDS_ACTUAL != "" && el.NO_OF_ENDS_ACTUAL != undefined && parseFloat(el.NO_OF_ENDS_ACTUAL)>0){
                obj.WSZ_SIZING_YARN_DETAIL_VIEW.push(
                  {
                    SIZING_YARN_DETAIL_ID: (el.SIZING_YARN_DETAIL_ID || 0),              
                    SIZING_YARN_HEADER_ID : (this.masterForm.value.SIZING_YARN_HEADER_ID ||0) ,
                    YARN_SNO: el.YARN_SNO,
                    BEAM_TYPE_DETAIL_RECORD_ID : el.BEAM_TYPE_DETAIL_RECORD_ID,
                    NO_OF_ENDS_ACTUAL: parseInt(el.NO_OF_ENDS_ACTUAL || 0),                    
                    ORGANIZATION_ID: '1948'                     
                  }
                )
              }
          });

          // console.log(obj);
        //debugger
          const req = new XMLHttpRequest();
          req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveYarnAssignmentData', true);
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

    UpdateNoOfEndsPerBeam(index)
    { const selected_wt = parseFloat(this.masterForm.controls.SELECTED_WT.value || 0);

        this.setTotalEnds();
//debugger
        this.fieldArray[index].REQUIRED_WEIGHT_ACTUAL =  (((parseFloat(this.fieldArray[index].YARN_WEIGHT_PERCENTAGE ||0) /100 *
        selected_wt)/parseFloat(this.fieldArray[index].NO_OF_ENDS || 1)) * parseFloat(this.fieldArray[index].NO_OF_ENDS_ACTUAL || 0)).toFixed(2)
    
        this.fieldArray[index].REQUIRED_WEIGHT_QVR = (parseFloat( this.fieldArray[index].YARN_WEIGHT_PERCENTAGE || 0 ) /100 * selected_wt).toFixed(3) ;     
    }

    setTotalEnds(){

        let TotalEnds,TotalLength : any ;
        TotalEnds = TotalLength =0;

          this.fieldArray.forEach(
            (fieldArray, index) => {
              //debugger
            TotalEnds  = TotalEnds + (parseInt(fieldArray.NO_OF_ENDS || 0));     
            TotalLength = TotalLength + (parseFloat(fieldArray.REQUIRED_LENGTH_QVR || 0));     
          }
        )        
        this.masterForm.get('NO_OF_ENDS').setValue(TotalEnds);
        this.masterForm.get('LENGTH_PER_BEAM').setValue(TotalLength.toFixed(3));
    }

}
