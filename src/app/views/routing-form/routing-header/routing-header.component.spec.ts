import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingHeaderComponent } from './routing-header.component';

describe('RoutingHeaderComponent', () => {
  let component: RoutingHeaderComponent;
  let fixture: ComponentFixture<RoutingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
