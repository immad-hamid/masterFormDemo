import { Component, OnInit } from '@angular/core';
// ng Modal
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SubjectService } from '../../services/subject.service';
import { PricingService } from '../../services/pricing/pricing.service';

@Component({
  selector: 'app-common-grid',
  templateUrl: './common-grid.component.html',
  styleUrls: ['./common-grid.component.scss']
})
export class CommonGridComponent implements OnInit {

  loader: boolean = true;
  closeBtnName: string;
  list: any[] = [];
  rows = [];
  temp = [];
  columns: any[] = [];
  url: string;
  HttpType: string;
  name : string;

  constructor(
    private subService: SubjectService,
    public bsModalRef: BsModalRef,
    private psService: PricingService) { }

  ngOnInit() {
    // this.list.push();
    // this.columns.push();

    console.log(this.list);
    console.log(this.columns);
    console.log(this.url)

    const obj = {
      iColumns: 1,
      iDisplayLength: 1,
      iDisplayStart: 1,
      iSortingCols: 1,
      sColumns: 1,
      sEcho: 1,
      sSearch: 1,
      sSearch_0: 1,
      sSearch_1: 1,
      sSearch_2: 1,
      sSearch_3: 1,
      sSearch_4: 1,
      Startdate: 1,
      Enddate: 1,
      States: 1,
      DAT: 1,
      EmptyPro: 1,
      OfferIDs: 1,
      CsvFile: 1,
      sSearch_5: 1,
      sSearch_6: 1,
      sSearch_7: 1,
      sSearch_8: 1,
      sSearch_9: 1,
      sSearch_10: 1,
      sSearch_11: 1,
      sSearch_12: 1,
      sSearch_18: 1,
      sSearch_17: 1,
      sSearch_16: 1,
      sSearch_15: 1,
      sSearch_14: 1,
      sSearch_13: 1,
      Displayname: 1,
      PositionValue: 1,
      PeriodValue: 1,
      FamilyIDCSV: 1,
      CommercialIDCSV: 1,
      TipiIDCSV: 1,
      OwnerDBCSV: 1,
      OnlyUnAssigned: 1,
      filterConflicted: 1,
      dataid: 12
    }

    this.psService.getData(this.url,this.HttpType).subscribe(
      (res: any) => {
        
        this.loader = false;
        // cache our list
        this.temp = [...res];
        // push our inital complete list
        this.rows = res;
      },
      err => console.log(err)

    );
  }

  onSelect(event) {
    //debugger
    if(this.name == 'OPERATION')
    this.subService.gridData.next({
      dataFromGrid: event
    });

    if(this.name == 'ROUTING_CLASS')
    this.subService.RoutingClassData.next({
      dataFromGrid: event
    });

    if(this.name == 'ROUTING')
    this.subService.headerData.next({
      dataFromGrid: event
    });

    this.bsModalRef.hide();
  }

  updateFilter(event) {
    console.log(event);
    const val = event.target.value;

    // filter our data
    console.log(this.temp);
    const temp = this.temp.filter((d) => {
      return d.OPRN_NAME.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
  }
}
