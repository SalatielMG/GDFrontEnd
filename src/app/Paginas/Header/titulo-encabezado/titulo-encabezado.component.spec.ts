import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloEncabezadoComponent } from './titulo-encabezado.component';

describe('TituloEncabezadoComponent', () => {
  let component: TituloEncabezadoComponent;
  let fixture: ComponentFixture<TituloEncabezadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TituloEncabezadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TituloEncabezadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
