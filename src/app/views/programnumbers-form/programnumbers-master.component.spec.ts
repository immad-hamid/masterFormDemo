import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramnumbersMasterComponent } from './programnumbers-master.component';

describe('ProgramnumbersMasterComponent', () => {
  let component: ProgramnumbersMasterComponent;
  let fixture: ComponentFixture<ProgramnumbersMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramnumbersMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramnumbersMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
