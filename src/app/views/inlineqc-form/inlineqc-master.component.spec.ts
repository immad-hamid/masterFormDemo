import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineqcMasterComponent } from './inlineqc-master.component';

describe('InlineqcMasterComponent', () => {
  let component: InlineqcMasterComponent;
  let fixture: ComponentFixture<InlineqcMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineqcMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineqcMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
