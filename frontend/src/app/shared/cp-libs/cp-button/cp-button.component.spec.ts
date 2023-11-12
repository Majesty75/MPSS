import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpButtonComponent } from './cp-button.component';

describe('CpButtonComponent', () => {
  let component: CpButtonComponent;
  let fixture: ComponentFixture<CpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CpButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
