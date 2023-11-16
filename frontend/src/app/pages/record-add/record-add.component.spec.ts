import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAddComponent } from './record-add.component';

describe('RecordAddComponent', () => {
  let component: RecordAddComponent;
  let fixture: ComponentFixture<RecordAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecordAddComponent]
    });
    fixture = TestBed.createComponent(RecordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
