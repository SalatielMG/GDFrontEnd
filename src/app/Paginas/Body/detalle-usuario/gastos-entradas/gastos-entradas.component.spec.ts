import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosEntradasComponent } from './gastos-entradas.component';

describe('GastosEntradasComponent', () => {
  let component: GastosEntradasComponent;
  let fixture: ComponentFixture<GastosEntradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosEntradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
