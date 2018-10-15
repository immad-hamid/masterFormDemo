import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnassignmentMasterComponent } from './yarnassignment-master.component';

describe('YarnassignmentMasterComponent', () => {
  let component: YarnassignmentMasterComponent;
  let fixture: ComponentFixture<YarnassignmentMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YarnassignmentMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YarnassignmentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
