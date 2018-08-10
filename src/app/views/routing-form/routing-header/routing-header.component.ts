import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LovGridComponent } from '../../../common/lov-grid/lov-grid.component';

import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { SubjectService } from '../../../services/subject.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'routing-header',
  templateUrl: './routing-header.component.html',
  styleUrls: ['./routing-header.component.scss']
})
export class RoutingHeaderComponent implements OnInit, OnDestroy {
  masterForm;
  status :{value:number,name:string}[] ;
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService,
     private subService: SubjectService,
     public fb: FormBuilder
    ) { 
    this.subService.gridData.subscribe(
      lovData => {
        const objRouting =lovData.dataFromGrid.selected[0];
        this.ROUTING_CLASS_ID.setValue(objRouting.ROUTING_CLASS_ID);
        this.ROUTING_CLASS.setValue(objRouting.ROUTING_CLASS);
        this.ROUTING_CLASS_NAME.setValue(objRouting.ROUTING_CLASS_NAME);
      });
  }

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
              ROUTING_CLASS_ID: [''],
              ROUTING_CLASS: ['', Validators.required],
              ROUTING_CLASS_NAME: [{value: '', disabled: true}],
              VERSION : [{value: '1', disabled: true}],
              ROUTING_DESC:['',Validators.required]
            });
  }

  ngOnDestroy() {
    this.subService.gridData.unsubscribe(); 
  }

  openModalGrid() {    
    this.bsModalRef = this.modalService.show(
      LovGridComponent, //{ initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  openModalSearchGrid() {  
    this.bsModalRef = this.modalService.show(
      CommonGridComponent, //{ initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  get ROUTING_CLASS_ID() { return this.masterForm.get('ROUTING_CLASS_ID') }
  get ROUTING_CLASS() { return this.masterForm.get('ROUTING_CLASS') }
  get ROUTING_CLASS_NAME() { return this.masterForm.get('ROUTING_CLASS_NAME') }
  get ROUTING_DESC() { return this.masterForm.get('ROUTING_CLASS_DESC') }
}
