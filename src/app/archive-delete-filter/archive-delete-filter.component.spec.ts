import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDeleteFilterComponent } from './archive-delete-filter.component';

describe('ArchiveDeleteFilterComponent', () => {
  let component: ArchiveDeleteFilterComponent;
  let fixture: ComponentFixture<ArchiveDeleteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDeleteFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveDeleteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
