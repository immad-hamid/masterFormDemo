import { config } from '../../../models/config';
import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { DatePipe } from '@angular/common';
import { ToastsManager,Toast } from 'ng2-toastr';
import { PricingService } from '../../../services/pricing/pricing.service';
import { FormBuilder } from '@angular/forms';
import { SubjectService } from '../../../services/subject.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'yarnassignment-header',
  templateUrl: './yarnassignment-header.component.html',
  styleUrls: ['./yarnassignment-header.component.scss']
})
export class YarnassignmentHeaderComponent implements OnInit {
  masterForm;
  editMode: boolean;
  status :{value:number,name:string}[] ;
  loaderVal: boolean; 
  bsModalRef: BsModalRef;
  toastrService: any;

  quality_code:string;
  beam_type:string;
  sizing_program_no:number;
  selected_wt : number;
  sizing_program_line_no:number;

  constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,
    public toastr: ToastsManager, vcr: ViewContainerRef ,
    private datePipe: DatePipe) {  
      this.toastr.setRootViewContainerRef(vcr); 

      this.subService.EntityData.subscribe((data) => {

        const obj = data.dataFromGrid.selected[0];  
        this.SIZING_YARN_HEADER_ID.setValue(obj.SIZING_YARN_HEADER_ID);
        this.SIZING_PROGRAM_DETAIL_ID.setValue(obj.SIZING_PROGRAM_DETAIL_ID);
        this.SELECTED_WT.setValue(obj.SELECTED_WT);
        this.SIZING_PROGRAM_HEADER_ID.setValue(obj.SIZING_PROGRAM_HEADER_ID);
        this.BEAM_TYPE.setValue(obj.BEAM_TYPE);
        this.NO_OF_ENDS.setValue(obj.NO_OF_ENDS);
        this.LENGTH_PER_BEAM.setValue(obj.LENGTH_PER_BEAM);
                 
        this.GetDetail(obj.SIZING_YARN_HEADER_ID);                
      }); 


    this.subService.message.subscribe((data) => {                    
        this.toastr.warning(data.message,'', {dismiss: 'click'})
        .then((toast: Toast) => {
            setTimeout(() => {
                this.toastr.dismissToast(toast);
            }, 3000);
        });
      })    
    }
    
    GetDetail(header_id)
    {
      let url:string;
      url = `http://${config.hostaddress}/api/Values/GetSizingYarnByID?id=${header_id}`, 
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
    
  this.quality_code = 'N1936BF6T'
  this.beam_type = 'GROUND'
  this.sizing_program_no =14
  this.sizing_program_line_no = 26
  this.selected_wt = 2

    this.masterForm = this.fb.group({
    SIZING_YARN_HEADER_ID: [],
    SIZING_PROGRAM_DETAIL_ID : [this.sizing_program_line_no],
    SIZING_PROGRAM_HEADER_ID :[this.sizing_program_no],      
    BEAM_TYPE: [this.beam_type],    
    NO_OF_ENDS : [],
    LENGTH_PER_BEAM : [],
    CREATED_BY : [],
    // CREATED_DATE: [],    
    UPDATED_BY : [],
    SELECTED_WT : [this.selected_wt]
    // UPDATED_DATE: [],
  });

  this.disableInputs();

  this.GetYarnAssignment();

}

GetYarnAssignment()
{
  let url:string;
  url = `http://${config.hostaddress}/api/Values/GetYarnAssignment?quality=${this.quality_code}&type=${this.beam_type}`, 
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

  openModalSearchGrid() {  
    const initialState = {
      list: [
        'This Modal will show the Data Grid...'
      ],
      columns: [
        { prop: 'SIZING_YARN_HEADER_ID', name: 'YARN ASSIGNMENT NO.' },
        { prop: 'SIZING_PROGRAM_NO', name: 'PROGRAM NO' },
        { prop: 'BEAM_TYPE_NAME', name: 'BEAM TYPE' },
        { prop: 'YARN_CODE', name: 'YARN CODE' },       
        { prop: 'NO_OF_ENDS_ACTUAL', name: 'NO OF ENDS (ACTUAL)' },            
      ],
      url: 'http://'+ config.hostaddress + '/api/Values/GetListYarnAssignment',
      HttpType : 'POST',
      name : "YARN_ASSIGNMENT"
    };
    this.bsModalRef = this.modalService.show(
      CommonGridComponent, { initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }


  clearInputs()
  {
    this.masterForm.reset();
    //this.STATUS.setValue(1);
    //this.CREATED_DATE.setValue(this.psService.getCurrDate());
  } 

  addRecord(){
    this.enableInputs();
    this.clearInputs();
  }

  // enabling inputs
enableInputs() {
  this.editMode = true; 
  // this.STATUS.enable(); 

  this.subService.EnableDisableInput.next(
  {   val: false,
    IsReset : false
  });
}

// disabling inputs
disableInputs() {
this.editMode = false; 

this.subService.EnableDisableInput.next({   
    val: true,
    IsReset : true 
  });
  //this.clearInputs();
} 


  get SIZING_YARN_HEADER_ID() { return this.masterForm.get('SIZING_YARN_HEADER_ID') }
  get SIZING_PROGRAM_DETAIL_ID() { return this.masterForm.get('SIZING_PROGRAM_DETAIL_ID') }
  get SIZING_PROGRAM_HEADER_ID() { return this.masterForm.get('SIZING_PROGRAM_HEADER_ID') }
  get BEAM_TYPE() { return this.masterForm.get('BEAM_TYPE') }
  get NO_OF_ENDS() { return this.masterForm.get('NO_OF_ENDS') }
  get LENGTH_PER_BEAM() { return this.masterForm.get('LENGTH_PER_BEAM') }
  get CREATED_BY() { return this.masterForm.get('NO_OF_ENDS') }
  get UPDATED_BY() { return this.masterForm.get('LENGTH_PER_BEAM') }
  get SELECTED_WT() { return this.masterForm.get('SELECTED_WT') }
}
