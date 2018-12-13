import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionunitMasterComponent } from './inspectionunit-master.component';

describe('InspectionunitMasterComponent', () => {
  let component: InspectionunitMasterComponent;
  let fixture: ComponentFixture<InspectionunitMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionunitMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionunitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
