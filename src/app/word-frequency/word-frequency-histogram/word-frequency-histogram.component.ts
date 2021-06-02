import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UserDataService } from "src/app/services/user-data.service";

@Component({
  selector: "app-word-frequency-histogram",
  templateUrl: "./word-frequency-histogram.component.html",
  styleUrls: ["./word-frequency-histogram.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordFrequencyHistogramComponent {
  readonly usersViewModel$ = this.userDataService.userViewModel$;

  constructor(private readonly userDataService: UserDataService) {}

  calcWidth(count: number, highestCount: number): number {
    return (count / highestCount) * 100;
  }
}
