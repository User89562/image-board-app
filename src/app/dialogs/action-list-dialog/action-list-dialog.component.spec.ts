import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionListDialogComponent } from './action-list-dialog.component';

describe('ActionListDialogComponent', () => {
  let component: ActionListDialogComponent;
  let fixture: ComponentFixture<ActionListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
