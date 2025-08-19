import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWidget } from './customer-widget';

describe('CustomerWidget', () => {
  let component: CustomerWidget;
  let fixture: ComponentFixture<CustomerWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
