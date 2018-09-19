import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizingprogramMasterComponent } from './sizingprogram-master.component';

describe('SizingprogramMasterComponent', () => {
  let component: SizingprogramMasterComponent;
  let fixture: ComponentFixture<SizingprogramMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizingprogramMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizingprogramMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
