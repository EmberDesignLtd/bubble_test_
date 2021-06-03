import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';
import { compareValue } from '../utils/compare';

interface RawUserData {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UserData {
  id: number;
  name: string;
}

export interface UserPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface UserComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface UserCommentAndPost {
  comments: UserComment[];
  posts: UserPost[];
}

export interface UserViewModel {
  users: UserData[];
  searchTerm: string;
  activeUserComments: UserComment[];
  activeUserPosts: UserPost[];
  loading: boolean;
  wordFrequency: WordFrequency;
}

export interface WordFrequency {
  totalWordCount: number;
  sortedAndCountedWords: SortedAndCountedWord[];
  highestCount: number;
}

export interface SortedAndCountedWord {
  word: string;
  count: number;
}

enum JsonPlaceHolderApi {
  USERS = 'https://jsonplaceholder.typicode.com/users',
  USER_POSTS = 'https://jsonplaceholder.typicode.com/posts?userId=',
  USER_COMMENTS = 'http://jsonplaceholder.typicode.com/comments?postId=',
}

const COUNT_KEY = 'count';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private state: UserViewModel = {
    users: [],
    searchTerm: '',
    activeUserComments: [],
    activeUserPosts: [],
    loading: false,
    wordFrequency: {
      totalWordCount: 0,
      sortedAndCountedWords: [] as SortedAndCountedWord[],
      highestCount: 0,
    },
  };

  private readonly store = new BehaviorSubject<UserViewModel>(this.state);
  private readonly state_$ = this.store.pipe(distinctUntilChanged());

  readonly userViewModel$: Observable<UserViewModel> = combineLatest([
    this.state_$,
  ]).pipe(
    map(([state]) => {
      return {
        activeUserPosts: state.activeUserPosts,
        activeUserComments: state.activeUserComments,
        searchTerm: state.searchTerm,
        users: state.users,
        loading: state.loading,
        wordFrequency: state.wordFrequency,
      };
    })
  );

  constructor(private readonly http: HttpClient) {
    this.getUsers()
      .pipe(take(1))
      .subscribe((users) =>
        this.updateState({ ...this.state, users, loading: false })
      );
  }

  getStateSnapshot(): UserViewModel {
    return {
      ...this.state,
      activeUserPosts: [...this.state.activeUserPosts],
      activeUserComments: [...this.state.activeUserComments],
    };
  }

  buildSearchTermControl(): FormControl {
    const searchTerm = new FormControl();
    searchTerm.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((value) => this.updateSearchTerm(value));
    return searchTerm;
  }

  updateSearchTerm(searchTerm: string): void {
    this.getUsers(searchTerm)
      .pipe(take(1))
      .subscribe((users) => {
        this.updateState({ ...this.state, searchTerm, users, loading: true });
      });
  }

  updateActiveUserPostsAndComments(id: number): void {
    this.getUserPostAndComments(id)
      .pipe(take(1))
      .subscribe((postAndComments) => {
        this.updateState({
          ...this.state,
          activeUserComments: postAndComments.comments,
          activeUserPosts: postAndComments.posts,
          wordFrequency: this.wordFrequency(postAndComments.comments),
        });
      });
  }

  private wordFrequency(comments: UserComment[]): WordFrequency {
    let sortedAndCountedWords: any[] = [];
    let totalWordCount = 0;
    comments.forEach((comment) => {
      const words = comment.body.split(' ');
      words.forEach((word) => {
        totalWordCount += 1;
        let found = false;
        let index = 0;
        for (var i = 0; i < sortedAndCountedWords.length; i++) {
          if (
            sortedAndCountedWords[i].word.toLowerCase() === word.toLowerCase()
          ) {
            found = true;
            index = i;
            break;
          }
        }
        if (found) {
          sortedAndCountedWords[index].count += 1;
        } else {
          sortedAndCountedWords.push({ word: word, count: 1 });
        }
      });
    });
    sortedAndCountedWords.sort((a, b) => compareValue(a, b, COUNT_KEY));
    sortedAndCountedWords = sortedAndCountedWords.splice(0, 10);
    return {
      sortedAndCountedWords,
      totalWordCount,
      highestCount: sortedAndCountedWords[0].count,
    };
  }

  private getUsers(userName = ''): Observable<UserData[]> {
    return this.http.get<RawUserData[]>(JsonPlaceHolderApi.USERS).pipe(
      map((userDataArr: RawUserData[]) => {
        return userDataArr
          .map((userData) => {
            return { name: userData.name, id: userData.id };
          })
          .filter((user) =>
            user.name.toLowerCase().includes(userName.toLowerCase())
          );
      })
    );
  }

  private getUserPost(id: number): Observable<UserPost[]> {
    return this.http.get<UserPost[]>(`${JsonPlaceHolderApi.USER_POSTS}${id}`);
  }

  private getUserComments(id: number): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(
      `${JsonPlaceHolderApi.USER_COMMENTS}${id}`
    );
  }

  private getUserPostAndComments(id: number): Observable<UserCommentAndPost> {
    return combineLatest([this.getUserComments(id), this.getUserPost(id)]).pipe(
      map(([comments, posts]) => {
        return { comments, posts };
      })
    );
  }

  private updateState(state: UserViewModel): void {
    this.store.next((this.state = state));
  }
}
