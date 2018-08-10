import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingDetailComponent } from './routing-detail.component';

describe('RoutingDetailComponent', () => {
  let component: RoutingDetailComponent;
  let fixture: ComponentFixture<RoutingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
