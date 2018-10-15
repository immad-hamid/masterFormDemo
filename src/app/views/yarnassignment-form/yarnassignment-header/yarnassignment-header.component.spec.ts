import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnassignmentHeaderComponent } from './yarnassignment-header.component';

describe('YarnassignmentHeaderComponent', () => {
  let component: YarnassignmentHeaderComponent;
  let fixture: ComponentFixture<YarnassignmentHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YarnassignmentHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YarnassignmentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
