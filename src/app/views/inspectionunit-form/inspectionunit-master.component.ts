import { config } from '../../models/config';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SubjectService } from '../../services/subject.service';
import { FormBuilder } from '@angular/forms';
import { PricingService } from '../../services/pricing/pricing.service';
import {  ToastsManager, Toast } from 'ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'inspectionunit-master',
  templateUrl: './inspectionunit-master.component.html',
  styleUrls: ['./inspectionunit-master.component.scss']
})
export class InspectionunitMasterComponent implements OnInit {
  
  inspection_units :{UNIT_NAME:string,IS_SELECT:boolean}[];
  i_units : any;
  constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef,
    private router: Router) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
      this.getAllInspectionUnits();
  }

  getAllInspectionUnits(){
    this.inspection_units=[];
    let url:string;
    url = 'http://'+ config.hostaddress + '/api/Values/GetInspectionUnits', 
    this.psService.getData(url,'GET').subscribe(
      (res: any) => {        
        this.i_units = res;
       this.FillInspectionUnits(res);       
      },
      err => console.log(err)  
    );    
  }

  FillInspectionUnits(inspection_units){ 
        for (let i = 0; i < inspection_units.length; i++) {
          //let num =  program_no.toString() + this.doffing_no.toString() + i.toString();
          this.inspection_units.push({UNIT_NAME: `Unit - ${inspection_units[i].INSPECTION_UNIT_NO} from Loom No. ${inspection_units[i].FROM_LOOM_CODE} to ${inspection_units[i].TO_LOOM_CODE}` ,IS_SELECT:false });
    }
  }

  Go(){
  // debugger
    let selectedrows = this.inspection_units.filter( x => x.IS_SELECT == true);
      if(selectedrows.length > 0){
      let numbers : number[] = [] ; 
      let number_range : string = "";
      selectedrows.forEach((item, index) => {     
        numbers.push(parseInt(item.UNIT_NAME.split(" ")[6]))
        numbers.push(parseInt(item.UNIT_NAME.split(" ")[8]))
        number_range = number_range + (parseInt(item.UNIT_NAME.split(" ")[6]) + "-" + parseInt(item.UNIT_NAME.split(" ")[8]) + ",").toString()
      });
      //let min_num = Math.min(...numbers);
      //let max_num = Math.max(...numbers);
      //let id =  min_num + "-" + max_num;
      let id = "";
      if(number_range.length>0){
        id = number_range.substr(0,number_range.length-1);
      }
      this.router.navigate(['/loomnumbers-master',id ]);
    }
    else{
      this.ShowMessage("Please select atleast one Inspection Unit.");
    }
  }

  ShowMessage(msg)
  {
      this.toastr.success(msg,'', {dismiss: 'click'})
          .then((toast: Toast) => { setTimeout(() => { this.toastr.dismissToast(toast); }, 3000);
      });              
  }
}
