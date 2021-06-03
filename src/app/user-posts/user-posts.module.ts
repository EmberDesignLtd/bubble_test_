import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TitleModule } from './../title/title.module';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  declarations: [PostComponent, PostsComponent],
  imports: [CommonModule, TitleModule],
  exports: [PostsComponent],
})
export class UserPostsModule {}
