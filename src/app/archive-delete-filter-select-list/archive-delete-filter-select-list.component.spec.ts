import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDeleteFilterSelectListComponent } from './archive-delete-filter-select-list.component';

describe('ArchiveDeleteFilterSelectListComponent', () => {
  let component: ArchiveDeleteFilterSelectListComponent;
  let fixture: ComponentFixture<ArchiveDeleteFilterSelectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDeleteFilterSelectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveDeleteFilterSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
