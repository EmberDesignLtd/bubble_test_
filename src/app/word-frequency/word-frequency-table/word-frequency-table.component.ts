import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-word-frequency-table',
  templateUrl: './word-frequency-table.component.html',
  styleUrls: ['./word-frequency-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordFrequencyTableComponent {
  readonly usersViewModel$ = this.userDataService.userViewModel$;

  constructor(private readonly userDataService: UserDataService) {}

  asPercent(wordCount: number, totalWordCount: number): number {
    return Math.round((wordCount / totalWordCount) * 100 * 10) / 10;
  }
}
