import { config } from './../../../models/config';
import { CommonGridComponent } from './../../../common/common-grid/common-grid.component';
import { DatePipe } from '@angular/common';
import { ToastsManager } from 'ng2-toastr';
import { PricingService } from './../../../services/pricing/pricing.service';
import { FormBuilder } from '@angular/forms';
import { SubjectService } from './../../../services/subject.service';
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

  constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,
    public toastr: ToastsManager, vcr: ViewContainerRef ,
    private datePipe: DatePipe) {  
      this.toastr.setRootViewContainerRef(vcr); 
    }

  ngOnInit() {
    
  this.quality_code = '1212-19/EPA'
  this.beam_type = 'GROUND'
  this.sizing_program_no = 2

    this.masterForm = this.fb.group({
    SIZING_YARN_HEADER_ID: [],
    SIZING_PROGRAM_DETAIL_ID : [],
    SIZING_PROGRAM_HEADER_ID :[this.sizing_program_no],      
    BEAM_TYPE: [this.beam_type],    
    NO_OF_ENDS : [],
    LENGTH_PER_BEAM : [],
    CREATED_BY : [],
    // CREATED_DATE: [],    
    UPDATED_BY : [],
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
{ val: false,
  IsReset : false
 }
);
}

// disabling inputs
disableInputs() {
this.editMode = false; 

this.subService.EnableDisableInput.next(
{ val: true,
  IsReset : true 
}
);
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
}
