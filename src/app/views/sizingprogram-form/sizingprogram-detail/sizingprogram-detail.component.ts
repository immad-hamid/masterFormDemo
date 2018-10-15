import { config } from '../../../models/config';
import { PricingService } from '../../../services/pricing/pricing.service';
import { SubjectService } from '../../../services/subject.service';
import { ToastsManager, Toast } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { toTypeScript } from '@angular/compiler';

@Component({
  selector: 'sizingprogram-detail',
  templateUrl: './sizingprogram-detail.component.html',
  styleUrls: ['./sizingprogram-detail.component.scss']
})
export class SizingprogramDetailComponent implements OnInit {
  @Input() masterForm: any; 
  @Input() loader: boolean; 

  selectedTab : number
  loomtypes: any;
  
  masterFormData: any;
  PO_index:number;
  
  IsDisable : boolean;    
  IsValid : boolean;
  message: any;
  
  private loom_types : {LOOM_TYPE_CODE: number, LOOM_TYPE : string}[] ;

  private fieldArray: Array<any> = [{PO_NO: '',
    RECORD_ID: '',
    WEAVER_CODE: '',
    WEAVER_NAME : '',
    QUALITY_SNO : '',
    QUALITY_CODE : '',
    PO_QTY : '',
    NO_OF_PCS : '',
    ALREADY_SELECTED_WT : '',
    BALANCE_WT : '',
    REQUIRED_WT : '',
    LOOM_TYPE_CODE :'',
    NO_OF_PANEL :'',
    AVG_REED_SPACE:'',
    disabled: true,
    rowEditMode: true
    }];

    private YarnDetailArray: Array<any> = [{BEAM_TYPE: '',
    RECORD_ID: '',
    DETAIL_RECORD_ID: '',
    LOOM_TYPE_CODE: '',
    NO_OF_PANEL : '',
    BEAM_WIDTH : '',
    NO_OF_ENDS : '',
    NO_OF_BEAMS : '',
    disabled: true,
    rowEditMode: true}];

  constructor(private modalService: BsModalService,public toastr: ToastsManager, vcr: ViewContainerRef,
    private subService: SubjectService,private psService: PricingService) {
      
      this.IsDisable=true;
      this.IsValid=true;
      this.subService.detailData.subscribe((data) => {
       // debugger             
        const dtlData = data.detailData;  
        this.PopulatePODetails(dtlData);  
             
      });
    }

//#region Fill Details

    PopulatePODetails(dtldata){
      //debugger
      
      console.log(this.loader);
      this.fieldArray = [];
      this.YarnDetailArray=[];
      this.selectedTab = 0;
      const lineItems = dtldata;
      
      lineItems.forEach(
        (lineItem, index) => {
          // debugger            
              const obj = {          
                PO_NO: lineItem.PO_NO,
                RECORD_ID: lineItem.RECORD_ID,
                WEAVER_CODE: lineItem.WEAVER_CODE,
                WEAVER_NAME : lineItem.WEAVER_NAME, 
                QUALITY_SNO : lineItem.QUALITY_SNO,
                QUALITY_CODE : lineItem.QUALITY_CODE,
                PO_QTY : lineItem.PO_QTY,
                NO_OF_PCS: lineItem.NO_OF_PCS,
                ALREADY_SELECTED_WT: lineItem.ALREADY_SELECTED_WT,
                BALANCE_WT : (lineItem.PO_QTY || 0) - (lineItem.ALREADY_SELECTED_WT || 0) - (lineItem.REQUIRED_WEIGHT || 0), 
                REQUIRED_WEIGHT : lineItem.REQUIRED_WEIGHT,
                LOOM_TYPE_CODE : lineItem.LOOM_TYPE_CODE,        
                NO_OF_PANEL : lineItem.NO_OF_PANEL,
                AVG_REED_SPACE : lineItem.AVG_REED_SPACE,
                SIZING_PROGRAM_DETAIL_ID : lineItem.SIZING_PROGRAM_DETAIL_ID
              }
              //debugger
              this.fieldArray.push(obj);
                       
              // if(index == lineItems.length-1)
              //   this.fieldArray[index].rowEditMode = true;
            
            }
      );   
    }
   
    FillYarnDetail(PO_index,yarn_dtl){
      this.YarnDetailArray = [];
      let lineItems = yarn_dtl;      
      let PO_obj = this.fieldArray[PO_index];

      let TotalEnds : number;
      TotalEnds=0;
      lineItems.forEach(
      (lineItem, index) => {
        //debugger          
            const obj = {          
              SIZING_PROGRAM_DETAIL_ID : lineItem.SIZING_PROGRAM_DETAIL_ID,
              BEAM_TYPE: lineItem.BEAM_TYPE,
              RECORD_ID: lineItem.RECORD_ID,
             // LOOM_TYPE_CODE: PO_obj.LOOM_TYPE_CODE,
             // NO_OF_PANEL : PO_obj.NO_OF_PANEL,
              BEAM_WIDTH : lineItem.BEAM_WIDTH,
              NO_OF_ENDS : lineItem.BEAM_TYPE == "PILE" ? lineItem.TOTAL_PILE_ENDS :lineItem.TOTAL_GROUND_ENDS ,
              NO_OF_BEAMS : lineItem.NO_OF_BEAMS,
              REQUIRED_WEIGHT : lineItem.REQUIRED_WEIGHT,
              disabled: true,
              rowEditMode: false
            }
            TotalEnds = TotalEnds + (obj.NO_OF_ENDS == undefined ? 0 : obj.NO_OF_ENDS);
            this.YarnDetailArray.push(obj);            
            //debugger                                                          
            // this.loom_types.filter(val => val.LOOM_TYPE_CODE === obj.LOOM_TYPE_CODE)
          }
        );
       
        this.YarnDetailArray.forEach(
          (YarnDetailArray, index) => {
            YarnDetailArray.BEAM_WIDTH = TotalEnds / (PO_obj.AVG_REED_SPACE == 0 || PO_obj.AVG_REED_SPACE == undefined ? 1 : PO_obj.AVG_REED_SPACE);             
          }
        )
    }

    //#region 

    ngOnInit() {    
      this.getLoomTypes();  
     
      this.subService.EnableDisableInput.subscribe(
        res => {       
                this.IsDisable = res.val;
                if(res.IsReset)
                  this.fieldArray= [{PO_NO: '',
                  RECORD_ID: '',
                  WEAVER_CODE: '',
                  WEAVER_NAME : '',
                  QUALITY_SNO : '',
                  QUALITY_CODE : '',
                  PO_QTY : '',
                  NO_OF_PCS : '',
                  ALREADY_SELECTED_WT : '',
                  BALANCE_WT : '',
                  REQUIRED_WT : '',
                  LOOM_TYPE_CODE :'',
                  NO_OF_PANEL :'',
                  AVG_REED_SPACE:'',                  
                  rowEditMode: true }]; 

                  this.YarnDetailArray = [{BEAM_TYPE: '',
                  RECORD_ID: '',
                  DETAIL_RECORD_ID: '',
                  LOOM_TYPE_CODE: '',
                  NO_OF_PANEL : '',
                  BEAM_WIDTH : '',
                  NO_OF_ENDS : '',
                  NO_OF_BEAMS : '',               
                  rowEditMode: true}]
          },
          error => console.log(error)
        );                   
        
      
    }

    ngOnDestroy() {
      this.subService.detailData.unsubscribe();      
      this.subService.EnableDisableInput.unsubscribe();
    }
    //#region get methods

    getLoomTypes(){
      let url:string;
      url = 'http://'+ config.hostaddress + '/api/Values/GetLoomType', 
      this.psService.getData(url,'GET').subscribe(
        (res: any) => {
          
          this.loom_types  = res;               
          this.loom_types.unshift({LOOM_TYPE_CODE: 0,
          LOOM_TYPE: 'Select Loom Type.'});
        },
        err => console.log(err)  
      );    
    }

    //#endregion

    //#region Button click methods
    ShowDetail(index)
    {
     
     //  debugger
       this.PO_index = index;
       this.selectedTab = 1;
       const id = this.fieldArray[index].RECORD_ID;
       const detail_id = this.fieldArray[index].SIZING_PROGRAM_DETAIL_ID;
       this.loader = true;
       let url:string;
       url = `http://${config.hostaddress}/api/Values/GetYarnDetails?record_id=${id}&detail_id=${detail_id}`, 
       this.psService.getData(url,'GET').subscribe(
         (res: any) => {           
          //debugger
          this.loader = false;
          this.FillYarnDetail(index,res);
       },
       err => console.log(err)  
      );      
    }
    //#endregion

    SaveYarnDetail(index){  
     
      let beam_ends_pile,beam_required_pile,beam_ends_ground,beam_required_ground :number;

      if(this.YarnDetailArray[index].BEAM_TYPE == "PILE")
      {
        beam_ends_pile = this.YarnDetailArray[index].NO_OF_ENDS;
        beam_required_pile = this.YarnDetailArray[index].NO_OF_BEAMS;
      }
      else
      {
        beam_ends_ground = this.YarnDetailArray[index].NO_OF_ENDS;
        beam_required_ground = this.YarnDetailArray[index].NO_OF_BEAMS;
      }
      //debugger
      if(this.fieldArray[this.PO_index].SIZING_PROGRAM_DETAIL_ID !="" && this.fieldArray[this.PO_index].SIZING_PROGRAM_DETAIL_ID !=undefined){
 
        const obj = {
          SIZING_PROGRAM_DETAIL_ID: this.fieldArray[this.PO_index].SIZING_PROGRAM_DETAIL_ID,
          BEAM_WIDTH: this.YarnDetailArray[index].BEAM_WIDTH,
          BEAMS_REQUIRED_GROUND: beam_required_ground,
          BEAMS_REQUIRED_PILE: beam_required_pile,          
          BEAM_ENDS_GROUND: beam_ends_ground,
          BEAMS_ENDS_PILE: beam_ends_pile,  
          BEAM_TYPE : this.YarnDetailArray[index].BEAM_TYPE        
        }

        const req = new XMLHttpRequest();
        req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveSizingProgramDetailData', true);
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
        this.subService.message.next(
          { message : "Record does not exist to save."  }
        );   
      }    
    }

    save(){  
      //debugger
      let isExist : boolean = false;
      this.IsValid=true;
      if(this.masterForm.value.STATUS == "0" )
      {
          this.subService.message.next(
            { message : "Please select Program Status."  }
          );
          this.IsValid=false;
      }
        this.fieldArray.forEach(el => {
          if(el.REQUIRED_WEIGHT != "" && el.REQUIRED_WEIGHT != undefined && el.REQUIRED_WEIGHT){
            isExist = true;
          }
        })

      if(!isExist)
      {  this.subService.message.next(
          { message : "Please enter selected weight in atleast one record." }
        );
        this.IsValid=false;
      }

        if (this.masterForm.valid && this.IsValid)
        {
            const obj = {
              SIZING_PROGRAM_HEADER_ID: this.masterForm.value.SIZING_PROGRAM_HEADER_ID === undefined ? "" : this.masterForm.value.SIZING_PROGRAM_HEADER_ID,
              STATUS: this.masterForm.value.STATUS,
              //UPDATED_BY: '',
              //UPDATE_DATE: '',
              ORGANIZATION_ID: '1948',      
              WSZ_SIZING_PROGRAM_DETAIL: []
        }

            this.fieldArray.forEach(el => {
              if(el.REQUIRED_WEIGHT != "" && el.REQUIRED_WEIGHT != undefined && parseFloat(el.REQUIRED_WEIGHT)>0){
                  obj.WSZ_SIZING_PROGRAM_DETAIL.push(
                    {
                      SIZING_PROGRAM_HEADER_ID: this.masterForm.value.SIZING_PROGRAM_HEADER_ID === undefined ? "" : this.masterForm.value.SIZING_PROGRAM_HEADER_ID,              
                      SIZING_PROGRAM_DETAIL_ID : this.masterForm.value.SIZING_PROGRAM_DETAIL_ID === undefined ? "" : this.masterForm.value.SIZING_PROGRAM_DETAIL_ID ,
                      PO_NO: el.PO_NO,
                      WEAVER_CODE: el.WEAVER_CODE,
                      QUALITY_SNO : el.QUALITY_SNO,
                      NO_OF_PANELS: el.NO_OF_PANEL,
                      PO_QUANTITY: el.PO_QTY,
                      REQUIRED_WEIGHT : el.REQUIRED_WEIGHT,
                      LOOM_TYPE_ID : el.LOOM_TYPE_CODE,
                      RECORD_ID : el.RECORD_ID,
                      // BEAM_WIDTH: el.BEAM_WIDTH,
                      // BEAMS_ENDS_PILE: el.BEAMS_ENDS_PILE,
                      // BEAMS_REQUIRED_PILE : el.BEAMS_REQUIRED_PILE,
                      // BEAM_ENDS_GROUND: el.BEAM_ENDS_GROUND,
                      // BEAMS_REQUIRED_GROUND : el.BEAMS_REQUIRED_GROUND,
                      CREATED_BY: '2',
                      ORGANIZATION_ID: '1948'                     
                    }
                  )
                }
            });

            // console.log(obj);
          //debugger
            const req = new XMLHttpRequest();
            req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveSizingProgramData', true);
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

    setBalanceWt(index){
    //  debugger

    if(((this.fieldArray[index].REQUIRED_WEIGHT || 0) + (this.fieldArray[index].ALREADY_SELECTED_WT || 0)) > (this.fieldArray[index].PO_QTY || 0))
    {
      this.subService.message.next(
        { message : "Selected Wt. exceeds the balance Wt. Please enter valid value." }
      );
    }

      this.fieldArray[index].BALANCE_WT =  (this.fieldArray[index].PO_QTY ||0) - 
      (this.fieldArray[index].ALREADY_SELECTED_WT ||0) - 
      (this.fieldArray[index].REQUIRED_WEIGHT||0)
    }
}
