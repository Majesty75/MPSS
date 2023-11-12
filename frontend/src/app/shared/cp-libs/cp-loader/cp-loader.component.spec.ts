import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpLoaderComponent } from './cp-loader.component';

describe('CpLoaderComponent', () => {
  let component: CpLoaderComponent;
  let fixture: ComponentFixture<CpLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CpLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
