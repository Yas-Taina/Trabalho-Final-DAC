import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGerentesComponent } from './editar-gerentes.component';

describe('EditarGerentesComponent', () => {
  let component: EditarGerentesComponent;
  let fixture: ComponentFixture<EditarGerentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarGerentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarGerentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
