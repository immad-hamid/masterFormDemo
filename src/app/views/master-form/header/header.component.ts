import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// ng Modal
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// component from where we will open our modal
import { CommonGridComponent } from '../../../common/common-grid/common-grid.component';
import { FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'master-form-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  subject
  bsModalRef: BsModalRef;
  editMode: boolean;
  masterForm;

  constructor(
    private modalService: BsModalService,
    public fb: FormBuilder,
    private subService: SubjectService
  ) { }

  ngOnInit() {
    this.masterForm = this.fb.group({
      operation: ['', Validators.required],
      status: ['', Validators.required],
      class: ['', Validators.required],
      descShort: [],
      descLong: ['', Validators.required]
    });
  }

  // getter methods for form
  get operation() { return this.masterForm.get('operation') }
  get status() { return this.masterForm.get('status') }
  get class() { return this.masterForm.get('class') }
  get descShort() { return this.masterForm.get('descShort') }
  get descLong() { return this.masterForm.get('descLong') }

  // enabling and disabling inputs
  enableInputs() {
    this.editMode = true; this.operation.enable(); this.status.enable(); this.class.enable(); this.descShort.enable(); this.descLong.enable();
  }
  disableInputs() {
    this.editMode = false; this.operation.disable(); this.status.disable(); this.class.disable(); this.descShort.disable(); this.descLong.disable();
  }

  saveRecord() {
    this.subService.headerData.next({
      operation: this.operation.value,
      status: this.status.value,
      class: this.class.value,
      descShort: this.descShort.value,
      descLong: this.descLong.value
    });
  }

  openModalGrid() {
    const initialState = {
      list: [
        'This Modal will show the Data Grid...'
      ],
      abc: 'Immad'
    };
    this.bsModalRef = this.modalService.show(
      CommonGridComponent, { initialState }
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}
