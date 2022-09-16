import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayChunkSelectListComponent } from './image-display-chunk-select-list.component';

describe('ImageDisplayChunkSelectListComponent', () => {
  let component: ImageDisplayChunkSelectListComponent;
  let fixture: ComponentFixture<ImageDisplayChunkSelectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageDisplayChunkSelectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDisplayChunkSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
