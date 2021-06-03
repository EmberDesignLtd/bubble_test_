import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DocumentEvent } from 'src/app/enums/document-events';
import { UserData, UserDataService } from './../../services/user-data.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  readonly usersViewModel$ = this.userDataService.userViewModel$;
  readonly searchTerm: FormControl;
  optionsVisible = false;
  @HostListener(`${DocumentEvent.ESCAPE}`, ['$event']) onKeydownHandler() {
    this.hideOptions();
  }

  constructor(private readonly userDataService: UserDataService) {
    const { searchTerm } = this.userDataService.getStateSnapshot();
    this.searchTerm = this.userDataService.buildSearchTermControl();
    this.searchTerm.patchValue(searchTerm, { emitEvent: false });
  }

  showOptions(): void {
    this.optionsVisible = true;
  }

  hideOptions(): void {
    this.optionsVisible = false;
  }

  setCurrentUser(user: UserData): void {
    this.hideOptions();
    this.userDataService.updateActiveUserPostsAndComments(user);
  }
}
