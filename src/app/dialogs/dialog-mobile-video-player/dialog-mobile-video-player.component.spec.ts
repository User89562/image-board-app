import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMobileVideoPlayerComponent } from './dialog-mobile-video-player.component';

describe('DialogMobileVideoPlayerComponent', () => {
  let component: DialogMobileVideoPlayerComponent;
  let fixture: ComponentFixture<DialogMobileVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMobileVideoPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMobileVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
