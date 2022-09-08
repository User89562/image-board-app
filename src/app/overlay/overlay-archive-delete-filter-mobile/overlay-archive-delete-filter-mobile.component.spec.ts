import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayArchiveDeleteFilterMobileComponent } from './overlay-archive-delete-filter-mobile.component';

describe('OverlayArchiveDeleteFilterMobileComponent', () => {
  let component: OverlayArchiveDeleteFilterMobileComponent;
  let fixture: ComponentFixture<OverlayArchiveDeleteFilterMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayArchiveDeleteFilterMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayArchiveDeleteFilterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
