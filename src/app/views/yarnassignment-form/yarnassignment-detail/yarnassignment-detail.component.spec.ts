import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnassignmentDetailComponent } from './yarnassignment-detail.component';

describe('YarnassignmentDetailComponent', () => {
  let component: YarnassignmentDetailComponent;
  let fixture: ComponentFixture<YarnassignmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YarnassignmentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YarnassignmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
