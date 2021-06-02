import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  declarations: [PostComponent, PostsComponent],
  imports: [CommonModule],
  exports: [PostsComponent],
})
export class UserPostsModule {}
