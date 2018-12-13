import { ActivatedRoute, Router } from '@angular/router';
import { ProgramnumbersMasterComponent } from '../programnumbers-form/programnumbers-master.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { config } from '../../models/config';
import { ToastsManager, Toast } from 'ng2-toastr';
import { PricingService } from '../../services/pricing/pricing.service';
import { FormBuilder } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'loomnumbers-master',
  templateUrl: './loomnumbers-master.component.html',
  styleUrls: ['./loomnumbers-master.component.scss']
})
export class LoomnumbersMasterComponent implements OnInit {

  id : string;
  loom_numbers_cols : {col1 : string,col2 : string,col3 : string,col4 : string,col5 : string,col6 : string,col7 : string,col8 : string}[] = []

  str_range : string; //= "1-24,49-100"

  from_no : number //=400;
  to_no : number //= 450;
  number_count : number;

  bsModalRef: BsModalRef;  

  constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef ,private router: Router,
    private route : ActivatedRoute) { 
      this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    let params = this.route.snapshot.paramMap;
    this.str_range = params.get('id');
    this.generateLoomNo();
  }

  generateLoomNo(){
    let range = this.str_range.split(",");

    let l_numbers : number[] = [];

    range.forEach((item, index) => { 
        this.from_no = parseInt(item.split("-")[0]);
        this.to_no = parseInt(item.split("-")[1]);
        
        for (let i=this.from_no ; i<=this.to_no ; i++ )
        { 
          l_numbers.push(i);
        }
      })
    this.FillLoomNumbers(l_numbers);
  }

FillLoomNumbers(l_numbers){
  this.loom_numbers_cols = [];  
  let len = l_numbers.length/8;    
  let maxindex = l_numbers.length;
  let index = 0 ;
  
  for (let i=0 ; i<len ; i++ )
  {   
    let num : string[] = [];

    for(let j=0;j<8;j++){
      let empty_str = " ";
        if(index < maxindex)
        {
          num.push(l_numbers[index].toString());
          index++;
        }
        else
        {
          num.push(empty_str);
          index++;
        }
      }
      this.loom_numbers_cols.push({col1 : num[0] ,col2 : num[1] ,col3 : num[2] , col4 : num[3],col5 : num[4],col6 : num[5],col7 : num[6],col8 : num[7]});
    }
  }
  
  // generateLoomNo(){
  //   //debugger
  //   this.loom_numbers_cols = [];  
  //   let len = (this.to_no - this.from_no)/8;

  //   let index = this.from_no;
  //   for (let i=0 ; i<len ; i++ )
  //   { 
  //     let j = index;
  //     this.loom_numbers_cols.push({col1 : (j +0).toString() ,col2 : (j+1).toString() ,col3 : (j+2).toString(),col4 : (j+3).toString(),col5 : (j+4).toString(),col6 : (j+5).toString(),col7 : (j+6).toString(),col8 : (j+7).toString()});
  //     index = index+8;
  //   }
  // }

  LinktoProgram(loom_no){
    //alert(loom_no);
   // debugger
    if(loom_no != " "){
      this.getProgramNumbers(loom_no);     
    }
  }

  getProgramNumbers(loom_no)
  {
    let url:string;
    url = `http://`+ config.hostaddress + `/api/Values/GetProgramNumbers?loom_no=${loom_no}`, 
    this.psService.getData(url,'GET').subscribe(
      (res: any) => {      
       // debugger    
            if(res.length > 0){
            const initialState = { program_numbers : res, range :this.str_range };
        
            this.bsModalRef = this.modalService.show(
              ProgramnumbersMasterComponent, { initialState }
            );
            this.bsModalRef.content.closeBtnName = 'Close';             
           
          }
          else
          {
            this.ShowMessage("No Program No. found against selected Loom No.");
          }
      },
      err => console.log(err)  
    );   
  }

  ShowMessage(msg)
  {
      this.toastr.success(msg,'', {dismiss: 'click'})
          .then((toast: Toast) => { setTimeout(() => { this.toastr.dismissToast(toast); }, 3000);
      });              
  }

  Back()
  {
    this.router.navigate(['/']);
  }
}
