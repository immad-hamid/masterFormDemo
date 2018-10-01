import { ToastsManager,Toast } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { config } from './../../models/config';
import { PricingService } from './../../services/pricing/pricing.service';
import { SubjectService } from './../../services/subject.service';
import { Component, OnInit, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  obj:any;

  @Input() result:string="";  
  @Output() clicked=new EventEmitter<string>();  

  constructor(private modalService: BsModalService,public toastr: ToastsManager, vcr: ViewContainerRef,
    private subService: SubjectService,private psService: PricingService) { 
    this.subService.EntityData.subscribe(                 
      resp => { 
        this.obj = resp; 
      })
  }

  ngOnInit() {
  }

  saveData(){

    this.clicked.emit();  

    const req = new XMLHttpRequest();
    req.open('POST','http://'+ config.hostaddress + '/api/Values/Save', true);
    req.setRequestHeader('Content-type', 'application/json');

    req.onreadystatechange = () => {//Call a function when the state changes.
      if (req.readyState == 4 && req.status == 200) {             
         //alert(req.responseText);
         this.setMessage(req.responseText);
      }
    } 
    req.send(JSON.stringify(this.obj));             
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
