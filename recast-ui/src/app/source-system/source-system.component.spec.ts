import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceSystemComponent } from './source-system.component';

describe('SourceSystemComponent', () => {
  let component: SourceSystemComponent;
  let fixture: ComponentFixture<SourceSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
