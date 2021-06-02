import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordFrequencyHistogramComponent } from './word-frequency-histogram.component';

describe('WordFrequencyHistogramComponent', () => {
  let component: WordFrequencyHistogramComponent;
  let fixture: ComponentFixture<WordFrequencyHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordFrequencyHistogramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordFrequencyHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
