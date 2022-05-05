import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperUiComponent } from './stepper-ui.component';

describe('StepperUiComponent', () => {
  let component: StepperUiComponent;
  let fixture: ComponentFixture<StepperUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
