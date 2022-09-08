import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFilterConfirmationComponent } from './dialog-filter-confirmation.component';

describe('DialogFilterConfirmationComponent', () => {
  let component: DialogFilterConfirmationComponent;
  let fixture: ComponentFixture<DialogFilterConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFilterConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFilterConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
