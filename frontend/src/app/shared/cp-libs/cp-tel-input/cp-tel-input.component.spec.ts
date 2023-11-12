import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTelInputComponent } from './cp-tel-input.component';

describe('CpTelInputComponent', () => {
  let component: CpTelInputComponent;
  let fixture: ComponentFixture<CpTelInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CpTelInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpTelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
