import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TitleModule } from './../title/title.module';
import { WordFrequencyHistogramComponent } from './word-frequency-histogram/word-frequency-histogram.component';
import { WordFrequencyTableComponent } from './word-frequency-table/word-frequency-table.component';

@NgModule({
  declarations: [WordFrequencyTableComponent, WordFrequencyHistogramComponent],
  imports: [CommonModule, TitleModule],
  exports: [WordFrequencyHistogramComponent, WordFrequencyTableComponent],
})
export class WordFrequencyModule {}
