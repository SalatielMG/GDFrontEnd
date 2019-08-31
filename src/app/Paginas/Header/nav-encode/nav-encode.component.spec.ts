import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavEncodeComponent } from './nav-encode.component';

describe('NavEncodeComponent', () => {
  let component: NavEncodeComponent;
  let fixture: ComponentFixture<NavEncodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavEncodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavEncodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
