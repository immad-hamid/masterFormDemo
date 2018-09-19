import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizingprogramDetailComponent } from './sizingprogram-detail.component';

describe('SizingprogramDetailComponent', () => {
  let component: SizingprogramDetailComponent;
  let fixture: ComponentFixture<SizingprogramDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizingprogramDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizingprogramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
