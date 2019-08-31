import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardviewsComponent } from './cardviews.component';

describe('CardviewsComponent', () => {
  let component: CardviewsComponent;
  let fixture: ComponentFixture<CardviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
