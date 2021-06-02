import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  readonly usersViewModel$ = this.userDataService.userViewModel$;

  constructor(private readonly userDataService: UserDataService) {}
}
