import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarModule } from './search-bar/search-bar.module';
import { UserPostsModule } from './user-posts/user-posts.module';
import { WordFrequencyModule } from './word-frequency/word-frequency.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    SearchBarModule,
    UserPostsModule,
    WordFrequencyModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
