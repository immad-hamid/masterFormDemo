import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingMasterComponent } from './routing-master.component';

describe('RoutingMasterComponent', () => {
  let component: RoutingMasterComponent;
  let fixture: ComponentFixture<RoutingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
