import { PricingService } from './../../../services/pricing/pricing.service';
import { SubjectService } from './../../../services/subject.service';
import { ToastsManager } from 'ng2-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'sizingprogram-detail',
  templateUrl: './sizingprogram-detail.component.html',
  styleUrls: ['./sizingprogram-detail.component.scss']
})
export class SizingprogramDetailComponent implements OnInit {

  constructor(private modalService: BsModalService,public toastr: ToastsManager, vcr: ViewContainerRef,
    private subService: SubjectService,private psService: PricingService) { }

  ngOnInit() {
  }

}
