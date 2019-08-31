import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncodeMXComponent } from './encode-mx.component';

describe('EncodeMXComponent', () => {
  let component: EncodeMXComponent;
  let fixture: ComponentFixture<EncodeMXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncodeMXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncodeMXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
