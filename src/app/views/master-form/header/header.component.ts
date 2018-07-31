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
  statuses: { value: number; name: string; }[];
  classes: { value: number; name: string; }[];
  statusModel: any;

  constructor(
    private modalService: BsModalService,
    public fb: FormBuilder,
    private subService: SubjectService
  ) {

    this.subService.gridData.subscribe((data) => {
      const gridData = data.dataFromGrid.selected[0];

      // setting form values
      this.operation.setValue(gridData.OPRN_ID);
      this.operationName.setValue(gridData.OPRN_NAME);

      this.statuses.forEach((el) => {
        if (el.name === gridData.status) {
          this.status.setValue(el);
        }
      });
      // this.status.setValue({
      //   value: this.statuses.find(x => x.name === gridData.status).value,
      //   name: gridData.status
      // });
      this.class.setValue(gridData.OPRN_CLASS);
      this.descLong.setValue(gridData.OPRN_CLASS);

      console.log(this.status.value);
      console.log(this.statuses);


      if (gridData.OPRN_ID) {
        this.fetchGridData(gridData.OPRN_ID);
      }

      this.saveRecord();
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.value === c2.value : c1 === c2;
  }

  ngOnInit() {
    this.statuses = [
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

    this.classes = [
      {
        value: 55,
        name: "CORRUG OPR"
      },
      {
        value: 67,
        name: "CORRUG 2"
      },
      {
        value: 70,
        name: "CONVERSION"
      },
    ];

    this.masterForm = this.fb.group({
      operation: [''],
      operationName: ['', Validators.required],
      status: [this.statuses[0], Validators.required],
      class: ['', Validators.required],
      descLong: ['', Validators.required]
    });

    this.operation.disable();
  }

  // getter methods for form
  get operation() { return this.masterForm.get('operation') }
  get operationName() { return this.masterForm.get('operationName') }
  get status() { return this.masterForm.get('status') }
  get class() { return this.masterForm.get('class') }
  get descLong() { return this.masterForm.get('descLong') }

  ngOnDestroy() {
    this.subService.gridData.unsubscribe();
  }

  fetchGridData(id) {
    fetch(`http://C3-0467:8011/api/Values/GetOperationByID?operationID=${id}`)
      .then(res => res.json())
      .then(data =>
        this.subService.operationData.next({ operationData: data })
      )
      .catch(err => console.log(err));
  }

  // enabling inputs
  enableInputs() {
    this.editMode = true; this.status.enable(); this.class.enable(); this.operationName.enable(); this.descLong.enable();
  }

  // disabling inputs
  disableInputs() {
    this.editMode = false; this.status.disable(); this.class.disable(); this.operationName.disable(); this.descLong.disable();
  }

  // passing the record to detail component
  saveRecord() {
    this.subService.headerData.next({
      operation: this.operation.value,
      operationName: this.operationName.value,
      status: this.status.value,
      class: this.class.value,
      descLong: this.descLong.value
    });
  }

  // opening modal with data
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
