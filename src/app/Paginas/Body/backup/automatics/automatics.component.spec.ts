import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticsComponent } from './automatics.component';

describe('AutomaticsComponent', () => {
  let component: AutomaticsComponent;
  let fixture: ComponentFixture<AutomaticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomaticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
