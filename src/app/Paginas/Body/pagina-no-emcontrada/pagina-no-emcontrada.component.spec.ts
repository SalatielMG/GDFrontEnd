import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNoEmcontradaComponent } from './pagina-no-emcontrada.component';

describe('PaginaNoEmcontradaComponent', () => {
  let component: PaginaNoEmcontradaComponent;
  let fixture: ComponentFixture<PaginaNoEmcontradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaNoEmcontradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNoEmcontradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
