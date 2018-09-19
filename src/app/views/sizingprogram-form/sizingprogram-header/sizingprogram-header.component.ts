import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager } from 'ng2-toastr';
import { PricingService } from './../../../services/pricing/pricing.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubjectService } from './../../../services/subject.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BsModalService } from '../../../../../node_modules/ngx-bootstrap/modal/bs-modal.service';

@Component({
  selector: 'sizingprogram-header',
  templateUrl: './sizingprogram-header.component.html',
  styleUrls: ['./sizingprogram-header.component.scss']
})
export class SizingprogramHeaderComponent implements OnInit {
  masterForm;
  editMode: boolean;
  status :{value:number,name:string}[] ;
  bsModalRef: BsModalRef;
  toastrService: any;
  constructor(private modalService: BsModalService,
    private subService: SubjectService,
    public fb: FormBuilder,
    private psService: PricingService,public toastr: ToastsManager, vcr: ViewContainerRef) { }

  ngOnInit() {
    this.status = [
      {
        value: 1,
        name: "Pending"
      },
      {
        value: 2,
        name: "Sent for Approval"
      },
      {
        value: 3,
        name: "Approved"
      },
      {
        value: 4,
        name: "Cancel"
      }
    ];

    this.masterForm = this.fb.group({
      PROGRAM_ID: [{value:null}],
      PROGRAM_NO: [{value:null}],
      PROGRAM_STATUS: [null, Validators.required],
      PROGRAM_DATE: [{value:null, disabled: true}],
      WEAVER : [null,Validators.required],
      PO_NO : [{value: null}],
      QUALITY: [{value: 1}],
    });


  }

}
