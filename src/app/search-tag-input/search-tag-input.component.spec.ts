import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTagInputComponent } from './search-tag-input.component';

describe('SearchTagInputComponent', () => {
  let component: SearchTagInputComponent;
  let fixture: ComponentFixture<SearchTagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTagInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
