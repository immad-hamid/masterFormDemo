import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoomnumbersMasterComponent } from './loomnumbers-master.component';

describe('LoomnumbersMasterComponent', () => {
  let component: LoomnumbersMasterComponent;
  let fixture: ComponentFixture<LoomnumbersMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoomnumbersMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoomnumbersMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
