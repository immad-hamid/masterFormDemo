import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizingprogramHeaderComponent } from './sizingprogram-header.component';

describe('SizingprogramHeaderComponent', () => {
  let component: SizingprogramHeaderComponent;
  let fixture: ComponentFixture<SizingprogramHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizingprogramHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizingprogramHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
