import { Router } from '@angular/router';
import { config } from './../../models/config';
import { PricingService } from './../../services/pricing/pricing.service';
import { SubjectService } from './../../services/subject.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {   ToastsManager, Toast  } from 'ng2-toastr';
@Component({
  selector: 'programnumbers-master',
  templateUrl: './programnumbers-master.component.html',
  styleUrls: ['./programnumbers-master.component.scss']
})
export class ProgramnumbersMasterComponent implements OnInit {
  closeBtnName: string;  
  url: string;
  HttpType: string;
  program_numbers:{PROGRAM_NO : number}[];
  range : string;
 // program_numbers_cols : {col1 : string,col2 : string,col3 : string,col4 : string,col5 : string,col6 : string,col7 : string,col8 : string}[] = []

  constructor(private subService: SubjectService,
    public bsModalRef: BsModalRef,
    private psService: PricingService ,private router: Router) {  
      //this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    //console.log(this.loom_no);
    console.log(this.program_numbers);   
  }
  
  RedirectToInLineQC(id)
  {
//alert(id+","+ this.range);
    this.bsModalRef.hide();
    this.router.navigate(['/inlineqc-master', id , this.range ]);    
  }
  
}
