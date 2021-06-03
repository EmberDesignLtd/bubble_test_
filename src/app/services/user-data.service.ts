import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, forkJoin, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  take,
} from 'rxjs/operators';
import { compareValue } from '../utils/compare';

interface RawUserData {
  email: string;
  id: number;
  name: string;
  username: string;
  address: {
    city: string;
    street: string;
    suite: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    bs: string;
    catchPhrase: string;
    name: string;
  };
}

export interface UserData {
  id: number;
  name: string;
}

export interface UserPost {
  body: string;
  id: number;
  title: string;
  userId: number;
}

export interface UserComment {
  body: string;
  email: string;
  id: number;
  name: string;
  postId: number;
}

export interface UserCommentAndPost {
  comments: UserComment[];
  posts: UserPost[];
}

export interface UserViewModel {
  activeUser: string;
  activeUserComments: UserComment[];
  activeUserPosts: UserPost[];
  loading: boolean;
  searchTerm: string;
  users: UserData[];
  wordFrequency: WordFrequency;
}

export interface WordFrequency {
  highestCount: number;
  sortedAndCountedWords: SortedAndCountedWord[];
  totalWordCount: number;
}

export interface SortedAndCountedWord {
  count: number;
  word: string;
}

enum JsonPlaceHolderApi {
  USERS = 'https://jsonplaceholder.typicode.com/users',
  USER_POSTS = 'https://jsonplaceholder.typicode.com/posts?userId=',
  USER_COMMENTS = 'http://jsonplaceholder.typicode.com/comments?postId=',
}

const COUNT_KEY = 'count';

const wordFrequency = (comments: UserComment[]): WordFrequency => {
  const wordObj: { [key: string]: any } = {};
  let totalWordCount = 0;
  let sortedAndCountedWords = [];
  comments.forEach((comment) => {
    const words = comment.body.split(' ');
    words.forEach((word) => {
      totalWordCount += 1;
      if (word in wordObj) {
        wordObj[word] += 1;
      } else {
        wordObj[word] = 1;
      }
    });
  });
  for (let key in wordObj) {
    sortedAndCountedWords.push({ word: key, count: wordObj[key] });
  }
  sortedAndCountedWords = sortedAndCountedWords
    .sort((a, b) => compareValue(a, b, COUNT_KEY))
    .splice(0, 10);
  return {
    sortedAndCountedWords,
    totalWordCount,
    highestCount: sortedAndCountedWords[0].count,
  };
};

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private state: UserViewModel = {
    users: [],
    searchTerm: '',
    activeUser: '',
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
        ...state,
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

  updateActiveUserPostsAndComments(user: UserData): void {
    this.getUserPostAndComments(user.id)
      .pipe(take(1))
      .subscribe((postAndComments) => {
        this.updateState({
          ...this.state,
          activeUser: user.name,
          activeUserComments: postAndComments.comments,
          activeUserPosts: postAndComments.posts,
          wordFrequency: wordFrequency(postAndComments.comments),
        });
      });
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

  private getUserPostAndComments(id: number) {
    return this.getUserPost(id).pipe(
      mergeMap((posts) => {
        return forkJoin(
          posts.map((post) => {
            return this.getUserComments(post.id);
          })
        ).pipe(
          map((comments) => {
            return { comments: comments.flat(), posts };
          })
        );
      })
    );
  }

  private updateState(state: UserViewModel): void {
    this.store.next((this.state = state));
  }
}
