import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartAddComponent } from './part-add.component';

describe('PartAddComponent', () => {
  let component: PartAddComponent;
  let fixture: ComponentFixture<PartAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PartAddComponent]
    });
    fixture = TestBed.createComponent(PartAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
