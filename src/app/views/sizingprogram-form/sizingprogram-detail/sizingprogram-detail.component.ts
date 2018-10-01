import { config } from './../../../models/config';
import { PricingService } from './../../../services/pricing/pricing.service';
import { SubjectService } from './../../../services/subject.service';
import { ToastsManager, Toast } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { toTypeScript } from '../../../../../node_modules/@angular/compiler';

@Component({
  selector: 'sizingprogram-detail',
  templateUrl: './sizingprogram-detail.component.html',
  styleUrls: ['./sizingprogram-detail.component.scss']
})
export class SizingprogramDetailComponent implements OnInit {
  @Input() masterForm: any; 
  // loader: boolean ;
  selectedTab : number
  loomtypes: any;
  IsValid : boolean;

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
    AVG_REED_SPACE:''
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
    
        this.subService.detailData.subscribe((data) => {
        //debugger      
       
        const dtlData = data.detailData;  
        this.PopulatePODetails(dtlData);
        
      });
    
    }

//#region Fill Details

    PopulatePODetails(dtldata){
      this.fieldArray = [];
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
                BALANCE_WT : lineItem.BALANCE_WT, 
                REQUIRED_WT : lineItem.REQUIRED_WT   ,
                LOOM_TYPE_CODE : lineItem.LOOM_TYPE_CODE,        
                NO_OF_PANEL : lineItem.NO_OF_PANEL,
                AVG_REED_SPACE : lineItem.AVG_REED_SPACE
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
      //  debugger          
            const obj = {          
              SIZING_PROGRAM_DETAIL_ID : lineItem.SIZING_PROGRAM_DETAIL_ID,
              BEAM_TYPE: lineItem.BEAM_TYPE,
              RECORD_ID: lineItem.RECORD_ID,
             // LOOM_TYPE_CODE: PO_obj.LOOM_TYPE_CODE,
             // NO_OF_PANEL : PO_obj.NO_OF_PANEL,
              BEAM_WIDTH : lineItem.BEAM_WIDTH,
              NO_OF_ENDS : lineItem.BEAM_TYPE == "PILE" ? lineItem.TOTAL_PILE_ENDS :lineItem.TOTAL_GROUND_ENDS ,
              NO_OF_BEAMS : lineItem.NO_OF_BEAMS,

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
       this.selectedTab = 1;
       const id = this.fieldArray[index].RECORD_ID;

       let url:string;
       url = `http://${config.hostaddress}/api/Values/GetYarnDetails?record_id=${id}`, 
       this.psService.getData(url,'GET').subscribe(
         (res: any) => {           
          //debugger
          this.FillYarnDetail(index,res);
        },
        err => console.log(err)  
      );      
    }
    //#endregion


    save(){  
            
      if(this.masterForm.value.PROGRAM_STATUS == "0" )
      {
          this.subService.message.next(
            { message : "Please select Program Status."  }
          );
          this.IsValid=false;
      }
        
        if(this.fieldArray[0].PROGRAM_STATUS=="" && this.fieldArray[0].LINE_NO=="")
        {  
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
              ROUTING_STATUS: this.masterForm.value.ROUTING_STATUS === undefined ? "" :this.masterForm.value.ROUTING_STATUS,
              LAST_UPDATED_BY: '',
              LAST_UPDATE_DATE: '',
              ORGANIZATION_ID: '1948',      
              WSZ_SIZING_PROGRAM_DETAIL: []
            }

            this.fieldArray.forEach(el => {
              if(el.OPRN_ID != "" && el.LINE_NO !=""){
                  obj.WSZ_SIZING_PROGRAM_DETAIL.push(
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
