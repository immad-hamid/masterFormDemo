import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LovGridComponent } from './lov-grid.component';

describe('LovGridComponent', () => {
  let component: LovGridComponent;
  let fixture: ComponentFixture<LovGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LovGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LovGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
