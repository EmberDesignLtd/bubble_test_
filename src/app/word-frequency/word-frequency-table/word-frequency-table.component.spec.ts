import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordFrequencyTableComponent } from './word-frequency-table.component';

describe('WordFrequencyTableComponent', () => {
  let component: WordFrequencyTableComponent;
  let fixture: ComponentFixture<WordFrequencyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordFrequencyTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordFrequencyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
