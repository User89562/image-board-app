import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayArchiveDeleteFilterComponent } from './overlay-archive-delete-filter.component';

describe('OverlayArchiveDeleteFilterComponent', () => {
  let component: OverlayArchiveDeleteFilterComponent;
  let fixture: ComponentFixture<OverlayArchiveDeleteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayArchiveDeleteFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayArchiveDeleteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
