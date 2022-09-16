import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayChunkComponent } from './image-display-chunk.component';

describe('ImageDisplayChuckComponent', () => {
  let component: ImageDisplayChunkComponent;
  let fixture: ComponentFixture<ImageDisplayChunkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageDisplayChunkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDisplayChunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
