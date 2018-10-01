import { config } from './../../../models/config';
import { PricingService } from './../../../services/pricing/pricing.service';
import { SubjectService } from './../../../services/subject.service';
import { ToastsManager } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { toTypeScript } from '../../../../../node_modules/@angular/compiler';

@Component({
  selector: 'sizingprogram-detail',
  templateUrl: './sizingprogram-detail.component.html',
  styleUrls: ['./sizingprogram-detail.component.scss']
})
export class SizingprogramDetailComponent implements OnInit {
  
  // loader: boolean ;
   selectedTab : number
   loomtypes: any;
  private loom_types : {LOOM_TYPE_CODE: number, LOOM_TYPE : string}[] ;

  private fieldArray: Array<any> = [{PO_NO: '',
    RECORD_ID: '',
    WEAVER_CODE: '',
    WEAVER_NAME : '',
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
             DETAIL_RECORD_ID : lineItem.DETAIL_RECORD_ID,
              BEAM_TYPE: lineItem.BEAM_TYPE,
              RECORD_ID: lineItem.RECORD_ID,
              LOOM_TYPE_CODE: PO_obj.LOOM_TYPE_CODE,
              NO_OF_PANEL : PO_obj.NO_OF_PANEL,
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


    getAllDataToSave(){  
      return "";
    }  
}
