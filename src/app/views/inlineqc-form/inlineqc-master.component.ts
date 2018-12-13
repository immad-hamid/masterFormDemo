import { Router, ActivatedRoute } from '@angular/router';
import { config } from '../../models/config';
import { DatePipe } from '@angular/common';
import {  ToastsManager, Toast } from 'ng2-toastr';
import { PricingService } from '../../services/pricing/pricing.service';
import { SubjectService } from '../../services/subject.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { daLocale } from 'ngx-bootstrap';

@Component({
  selector: 'inlineqc-master',
  templateUrl: './inlineqc-master.component.html',
  styleUrls: ['./inlineqc-master.component.scss']
})
export class InlineqcMasterComponent implements OnInit {
  batchers :{value:string}[] = [] ;
  pcs_per_border : {value:string}[] = [];
  a_pcs : {value:string}[] = [];
  b_pcs : {value:string}[] = [];
  c_pcs : {value:string}[] = [];
  b_percent : {value:string}[] = [];
  c_percent : {value:string}[] = [];
  no_of_defects : {value:string}[] = [];
  cut_pcs : {value:string}[] = [];
  program_no : number
  //doffing_no : number
  IsDisable : boolean
  IsEnable : boolean  

  No_Border_Disable:boolean
  Cut_Pcs_Disable:boolean
  No_Border_Enable : boolean
  Cut_Pcs_Enable : boolean
  Final_Close_Disable : boolean

  range : string

  private ProgramDtl : {PROGRAM_NO:number,QUALITY_CODE:string,QUALITY_SNO:number,LOOM_NO:number,NO_BATCHER:number,RECORD_ID:number,TOTAL_NO_OF_BORDERS:number,DOFFING_NO:number,IS_CLOSED:boolean,IS_STARTED:boolean,IS_FINAL_CLOSED:boolean,
    LDS_INLINE_QC_BATCHERS : {BATCHER_ID:string,NO_OF_PCS_PER_BORDER:number,CUT_PCS:number}[],
    LDS_INLINE_QC_BATCHER_DEFECTS : {BATCHER_ID:string,NO_OF_DEFECTS:number,DEFECT_GRADE:string}[],
  };

  private defects : {DEFECT_CODE: number, DEFECT_NAME : string , PCS_GRADE:string , COMPLAIN_REQUIRED:string}[] ;

    DEFECT_CODE : number
    masterForm;
    constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef ,private datePipe: DatePipe,
    private router: Router,private route : ActivatedRoute) { 
      this.toastr.setRootViewContainerRef(vcr);
      
    }

  ngOnInit() {
    
    this.getDefects();  
    let params = this.route.snapshot.paramMap;
    this.program_no = +params.get('id');
    this.range = params.get('range');
    //this.program_no = 90732;
   // this.doffing_no = 1;
    this.getProgramDetails();    
   
    this.masterForm = this.fb.group({
      PROGRAM_NO: [],      
      QUALITY_CODE: [],
      QUALITY_SNO: [],
      LOOM_NO: [],     
      TOTAL_NO_OF_BORDERS: [],
      RECORD_ID : [],
      DOFFING_NO : []
    });
  }

     //#region get methods

     getDefects(){
      
      let url:string;
      url = 'http://'+ config.hostaddress + '/api/Values/GetDefects', 
      this.psService.getData(url,'GET').subscribe(
        (res: any) => {
          
          this.defects  = res;               
          this.defects.unshift({DEFECT_CODE: 0,
          DEFECT_NAME: 'Select Defect.', PCS_GRADE:"",COMPLAIN_REQUIRED:""});
          this.DEFECT_CODE = 0;
        },
        err => console.log(err)  
      );    
    }

    getProgramDetails()
    {
      let url:string;
      url = `http://`+ config.hostaddress + `/api/Values/GetProgramDetails?program_no=${this.program_no}`, 
      this.psService.getData(url,'GET').subscribe(
        (res: any) => {          
          debugger
          this.ProgramDtl  = res;                             
          this.RECORD_ID.setValue( this.ProgramDtl.RECORD_ID); 
          this.PROGRAM_NO.setValue( this.ProgramDtl.PROGRAM_NO);        
          this.QUALITY_CODE.setValue(this.ProgramDtl.QUALITY_CODE);
          this.QUALITY_SNO.setValue(this.ProgramDtl.QUALITY_SNO);
          this.LOOM_NO.setValue(this.ProgramDtl.LOOM_NO);     
          this.TOTAL_NO_OF_BORDERS.setValue(this.ProgramDtl.TOTAL_NO_OF_BORDERS);     //to be set from other system
          this.DOFFING_NO.setValue(this.ProgramDtl.DOFFING_NO); 
          this.generateBatcher(this.ProgramDtl.NO_BATCHER,this.ProgramDtl.PROGRAM_NO, this.ProgramDtl.DOFFING_NO);
         // debugger
          if(this.ProgramDtl.DOFFING_NO === 1 && this.ProgramDtl.IS_CLOSED === false && this.ProgramDtl.IS_STARTED ===false )
          { ///inspection not started
            this.IsDisable = true;             
            this.IsEnable = false; 
            this.Cut_Pcs_Disable = true;
            this.No_Border_Disable = true;
            this.Cut_Pcs_Enable = true;
            this.No_Border_Enable = true;
          }
          else if(this.ProgramDtl.IS_CLOSED && this.ProgramDtl.IS_FINAL_CLOSED)
          {//inspection close and also final close
            this.IsDisable = true;             
            this.IsEnable = false; 
            this.Cut_Pcs_Disable = true;
            this.No_Border_Disable = true;
            this.Cut_Pcs_Enable = true;
            this.No_Border_Enable = true;
            this.Final_Close_Disable = true;
          }
          else if(this.ProgramDtl.IS_CLOSED && !this.ProgramDtl.IS_FINAL_CLOSED)
          {//inspection close but not final close
            this.IsDisable = true;             
            this.IsEnable = false; 
            this.Cut_Pcs_Disable = true;
            this.No_Border_Disable = true;
            this.Cut_Pcs_Enable = true;
            this.No_Border_Enable = true;
            this.Final_Close_Disable = false;
          }
          else if(this.ProgramDtl.IS_STARTED === true && !this.ProgramDtl.IS_CLOSED && !this.ProgramDtl.IS_FINAL_CLOSED)
          { //inspection started but not closed and final close
            this.IsDisable = false;             
            this.IsEnable = true; 
            this.Cut_Pcs_Disable = false;
            this.No_Border_Disable = false;
            this.Cut_Pcs_Enable = true;
            this.No_Border_Enable = true;
            this.Final_Close_Disable = true;
          }
          // else{
          //   this.IsDisable = false;
          //   this.IsEnable = true;
          // }
          //this.batchers = [{ value: "9036311"}, { value: "9036312" }, { value: "9036313"}, { value: "9036314" }];        
        },
        err => console.log(err)  
      );   
    }
    
    FillFields(){
     // debugger     
      let b_list = this.ProgramDtl.LDS_INLINE_QC_BATCHERS;
      let d_list = this.ProgramDtl.LDS_INLINE_QC_BATCHER_DEFECTS;
      if(b_list.length > 0){
        for (let i = 0; i < this.ProgramDtl.NO_BATCHER; i++) {     
        
             let b_id = this.batchers[i].value;  
             let pcs = b_list.filter(val => val.BATCHER_ID == b_id);
          
          if (pcs.length !=0){

             this.pcs_per_border[i].value = pcs[0].NO_OF_PCS_PER_BORDER.toString();
             this.cut_pcs[i].value = pcs[0].CUT_PCS.toString();
          
             let b_pcs = d_list.filter(val => val.BATCHER_ID == b_id && val.DEFECT_GRADE == "B");
             let c_pcs = d_list.filter(val => val.BATCHER_ID == b_id && val.DEFECT_GRADE == "C");
           
             if(b_pcs.length != 0)
              this.b_pcs[i].value = b_pcs[0].NO_OF_DEFECTS.toString();
             if (c_pcs.length != 0)
              this.c_pcs[i].value = c_pcs[0].NO_OF_DEFECTS.toString();
//debugger
              this.a_pcs[i].value = ( ((parseInt(this.pcs_per_border[i].value)||0) * this.masterForm.value.TOTAL_NO_OF_BORDERS)  -
              ( (parseInt(this.b_pcs[i].value)||0) + (parseInt(this.c_pcs[i].value)||0) )
              ).toString() 

                this.b_percent[i].value = ( ( ( (parseInt(this.b_pcs[i].value)||0)  / ( ( (parseInt(this.pcs_per_border[i].value)||1 ) *
              this.masterForm.value.TOTAL_NO_OF_BORDERS ) || 1) ) * 100 ).toFixed(3)
              ).toString()

              this.c_percent[i].value = ( ( ( (parseInt(this.c_pcs[i].value)||0)  / ( ( (parseInt(this.pcs_per_border[i].value)||1 ) *
              this.masterForm.value.TOTAL_NO_OF_BORDERS ) || 1) ) * 100 ).toFixed(3)
            ).toString()
          }
        }
      }
    }
    
    generateBatcher(total_batcher,program_no,doffing_no){
      this.batchers = [] ;
      this.pcs_per_border = [];
      this.a_pcs =  [];
      this.b_pcs  = [];
      this.c_pcs = [];
      this.b_percent  = [];
      this.c_percent  = [];
      this.no_of_defects = [];
      this.cut_pcs = [];

      for (let i = 0; i < total_batcher; i++) {
        //let num =  program_no.toString() + this.doffing_no.toString() + i.toString();
        this.batchers.push({value : program_no.toString() + doffing_no.toString() + (i+1).toString() });
        this.pcs_per_border.push({value: "0"});
        this.a_pcs.push({value: "0"});
        this.b_pcs.push({value: "0"});
        this.c_pcs.push({value: "0"});
        this.b_percent.push({value: "0"});
        this.c_percent.push({value: "0"}); 
        this.no_of_defects.push({value: "0"});
        this.cut_pcs.push({value: "0"});
      }
      this.FillFields();
    }

    Start()
    {
      if (this.masterForm.valid)
      {
          const obj = {             
            LOOM_NO : this.masterForm.value.LOOM_NO === undefined ? "" : this.masterForm.value.LOOM_NO,
            PROGRAM_NO : this.masterForm.value.PROGRAM_NO === undefined ? "" : this.masterForm.value.PROGRAM_NO,
            QUALITY_SNO : this.masterForm.value.QUALITY_SNO === undefined ? "" : this.masterForm.value.QUALITY_SNO,
            QUALITY_CODE : this.masterForm.value.QUALITY_CODE === undefined ? "" : this.masterForm.value.QUALITY_CODE,
            TOTAL_NO_OF_BORDERS : this.masterForm.value.TOTAL_NO_OF_BORDERS === undefined ? "" : this.masterForm.value.TOTAL_NO_OF_BORDERS,
            DOFFING_NO :  this.masterForm.value.DOFFING_NO === undefined ? "" : this.masterForm.value.DOFFING_NO,                
            LDS_INLINE_QC_BATCHERS: []
          }

              this.batchers.forEach(el => {           
                obj.LDS_INLINE_QC_BATCHERS.push(
                  {
                    BATCHER_ID : el.value
                  }
                )
              }
          );

          // console.log(obj);
         
          const req = new XMLHttpRequest();
          req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveOnStart', true);
          req.setRequestHeader('Content-type', 'application/json');

          req.onreadystatechange = () => {//Call a function when the state changes.
            if (req.readyState == 4 && req.status == 200) {             
               //alert(req.responseText);
               let val = req.responseText.split('|');
               if (val.length > 1){
                     this.setMessage(val[0],"Inspection started successfully.");
                     console.log("RECORD ID" + val[1]);
                  //   debugger
                      this.masterForm.value.RECORD_ID = val[1];
                      this.IsDisable = false;
                      this.IsEnable = true;
                      this.Cut_Pcs_Disable = false;
                      this.No_Border_Disable = false;
                      this.Final_Close_Disable = true;
               }
            }
          } 
          req.send(JSON.stringify(obj));                
      }
      else{

      }
    }
    
    Close()
    { 
      let url:string;
      url = `http://`+ config.hostaddress + `/api/Values/CloseInspection?id=${this.masterForm.value.RECORD_ID}`, 
      this.psService.getData(url,'GET').subscribe(
        (res: any) => {          
          this.setMessage(res,"Inspection closed successfully.") 
          debugger
         // this.IsDisable = true;
         // this.IsEnable = true   
          
            this.IsDisable = true;             
            this.IsEnable = false; 
            this.Cut_Pcs_Disable = true;
            this.No_Border_Disable = true;
            this.Cut_Pcs_Enable = true;
            this.No_Border_Enable = true;
            this.Final_Close_Disable = false;
        },
        err => console.log(err)  
      );   
    }

    FinalClose()
    { 
      let url:string;
      url = `http://`+ config.hostaddress + `/api/Values/FinalCloseInspection?id=${this.masterForm.value.RECORD_ID}`, 
      this.psService.getData(url,'GET').subscribe(
        (res: any) => {          
          this.setMessage(res,"Final Inspection closed successfully.") 
          this.IsDisable = true;
          this.IsEnable = true;
          this.Final_Close_Disable = false;                  
        },
        err => console.log(err)  
      );   
    }

    SaveBatchers()
    {     
      debugger 
      if (this.masterForm.valid)
      {  
          let LDS_INLINE_QC_BATCHERS : {IS_CUT_PCS : boolean,BATCHER_ID:string, NO_OF_PCS_PER_BORDER:string,INLINE_QC_RECORD_ID:number}[] = [];                     
          let i=0;
          let IsValid = false;
          let R_ID = parseInt(this.masterForm.value.RECORD_ID);
          this.batchers.forEach(el => {           
            if( (this.pcs_per_border[i].value || 0) > 0){
              IsValid = true;  
            }
              LDS_INLINE_QC_BATCHERS.push(
                  {
                    INLINE_QC_RECORD_ID : R_ID,
                    BATCHER_ID :(el.value),
                    NO_OF_PCS_PER_BORDER :  this.pcs_per_border[i].value, //this.pcs_per_border[i].value === undefined ? "0" : this.pcs_per_border[i].value
                    IS_CUT_PCS : false,
                  }
                )                
              //}
              i++;
            });

          // console.log(obj);
         if (IsValid){
            const req = new XMLHttpRequest();
            req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveBatchers', true);
            req.setRequestHeader('Content-type', 'application/json');

            req.onreadystatechange = () => {//Call a function when the state changes.
              if (req.readyState == 4 && req.status == 200) {             
                //alert(req.responseText);
                this.setMessage(req.responseText,"Record saved successfully.");
                this.getProgramDetails();
              this.No_Border_Disable = false;
              this.No_Border_Enable = true;
              }
            } 
            req.send(JSON.stringify(LDS_INLINE_QC_BATCHERS));                
          }
          else{
            this.ShowMessage("Please enter atleast one piece per border against any batcher.");
          }
      }
      else{

      }
    }
    
    setMessage(status,msg)
    {
      if(status.replace(/"/g,"") === '1' || status.replace(/"/g,"") == '2')
      {
        this.ShowMessage(msg);
      }
    }

    ShowMessage(msg)
    {
        this.toastr.success(msg,'', {dismiss: 'click'})
            .then((toast: Toast) => { setTimeout(() => { this.toastr.dismissToast(toast); }, 3000);
        });              
    }

    SaveDefects()
    { 
        let grade = this.defects.filter(val => val.DEFECT_CODE === this.DEFECT_CODE);
          //debugger 
        if (this.masterForm.valid)
        {   
            let LDS_INLINE_QC_BATCHER_DEFECTS : {DEFECT_CODE:number,DEFECT_GRADE:string,BATCHER_ID:string, NO_OF_DEFECTS:string,INLINE_QC_RECORD_ID:number}[] = [];                     
            let i=0;
            let IsValid = false;
            this.batchers.forEach(el => {           
              if( (this.no_of_defects[i].value || 0) > 0){
                IsValid = true;  
                LDS_INLINE_QC_BATCHER_DEFECTS.push(
                    {
                      INLINE_QC_RECORD_ID : this.masterForm.value.RECORD_ID,
                      BATCHER_ID : el.value,
                      NO_OF_DEFECTS : this.no_of_defects[i].value ,
                      DEFECT_CODE : this.DEFECT_CODE,
                      DEFECT_GRADE: grade != null ? grade[0].PCS_GRADE : "",
                    }
                  )                
                }
                i++;
              });

            // console.log(obj);
          if (IsValid){
              const req = new XMLHttpRequest();
              req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveBatcherDefects', true);
              req.setRequestHeader('Content-type', 'application/json');

              req.onreadystatechange = () => {//Call a function when the state changes.
                if (req.readyState == 4 && req.status == 200) {             
                  //alert(req.responseText);
                  //debugger
                  this.setMessage(req.responseText,"Record saved successfully.");
                  this.getProgramDetails();
                  this.DEFECT_CODE = 0;
                }
              } 
              req.send(JSON.stringify(LDS_INLINE_QC_BATCHER_DEFECTS));                
            }
            else{
              this.ShowMessage("Please enter No. of Defects against any batcher.");
            }
        }
        else{

        }
    }

    SaveCutPcs()
    {     
    //  debugger 
      if (this.masterForm.valid)
      {  
          let LDS_INLINE_QC_BATCHERS : {IS_CUT_PCS : boolean, BATCHER_ID:string, CUT_PCS:string,INLINE_QC_RECORD_ID:number}[] = [];                     
          let i=0;
          let IsValid = false;
          this.batchers.forEach(el => {           
            if( (this.cut_pcs[i].value || 0) > 0){
              IsValid = true;  
              LDS_INLINE_QC_BATCHERS.push(
                  {
                    INLINE_QC_RECORD_ID : this.masterForm.value.RECORD_ID,
                    BATCHER_ID : el.value,
                    CUT_PCS : this.cut_pcs[i].value ,
                    IS_CUT_PCS : true
                  }
                )                
              }
              i++;
            });

          // console.log(obj);
         if (IsValid){
            const req = new XMLHttpRequest();
            req.open('POST','http://'+ config.hostaddress + '/api/Values/SaveBatchers', true);
            req.setRequestHeader('Content-type', 'application/json');

            req.onreadystatechange = () => {//Call a function when the state changes.
              if (req.readyState == 4 && req.status == 200) {             
                //alert(req.responseText);
                this.setMessage(req.responseText,"Record saved successfully.");
                this.getProgramDetails();
                this.Cut_Pcs_Disable = false;
                this.Cut_Pcs_Enable = true;
              }
            } 
            req.send(JSON.stringify(LDS_INLINE_QC_BATCHERS));                
          }
          else{
            this.ShowMessage("Please enter No. of Cut Pcs against any batcher.");
          }
      }
      else{

      }
    }

    editNoOfBorderValue(index)
    {
      this.No_Border_Disable = true;
      this.No_Border_Enable = false;
      // this.pcs_per_border = [];
      // for (let i = 0; i < this.ProgramDtl.NO_BATCHER; i++) {
      //   this.pcs_per_border.push({value: "0"});
      // }
    }
    editCutPcsValue(index)
    { this.cut_pcs = [];
       for (let i = 0; i < this.ProgramDtl.NO_BATCHER; i++) {
         this.cut_pcs.push({value: "0"});
       }
      this.Cut_Pcs_Disable = true;
      this.Cut_Pcs_Enable = false;
    }
// GetTotalNoOfBorders()
// {
//   let url:string;
//   url = `http://`+ config.hostaddress + `/api/Values/GetTotalNoOfBorders?GetTotalNoOfBorders=${this.LOOM_NO}`, 
//   this.psService.getData(url,'GET').subscribe(
//     (res: any) => {          
//      // debugger
//       this.masterForm.value.TOTAL_NO_OF_BORDERS = res;
//     },
//     err => console.log(err)  
//   );   
// }

BackToLoom(){
//alert(this.range);
   this.router.navigate(['/loomnumbers-master',this.range]);    
}

     get PROGRAM_NO() { return this.masterForm.get('PROGRAM_NO') }
     get LOOM_NO() { return this.masterForm.get('LOOM_NO') }
     get TOTAL_NO_OF_BORDERS() { return this.masterForm.get('TOTAL_NO_OF_BORDERS') }
     get QUALITY_CODE() { return this.masterForm.get('QUALITY_CODE') }
     get QUALITY_SNO() { return this.masterForm.get('QUALITY_SNO') }
     get RECORD_ID() { return this.masterForm.get('RECORD_ID') }
     get DOFFING_NO() { return this.masterForm.get('DOFFING_NO')}
     
     //#endregion
}
