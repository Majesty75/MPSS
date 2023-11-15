import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPurchaseOrderComponent } from './daily-purchase-order.component';

describe('DailyPurchaseOrderComponent', () => {
  let component: DailyPurchaseOrderComponent;
  let fixture: ComponentFixture<DailyPurchaseOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DailyPurchaseOrderComponent]
    });
    fixture = TestBed.createComponent(DailyPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
