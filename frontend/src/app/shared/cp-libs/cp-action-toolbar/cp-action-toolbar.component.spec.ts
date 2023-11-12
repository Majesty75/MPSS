import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpActionToolbarComponent } from './cp-action-toolbar.component';

describe('CpActionToolbarComponent', () => {
  let component: CpActionToolbarComponent;
  let fixture: ComponentFixture<CpActionToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CpActionToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpActionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
