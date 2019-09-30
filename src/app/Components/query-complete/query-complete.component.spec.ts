import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCompleteComponent } from './query-complete.component';

describe('QueryCompleteComponent', () => {
  let component: QueryCompleteComponent;
  let fixture: ComponentFixture<QueryCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
