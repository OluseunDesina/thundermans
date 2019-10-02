import { Injectable } from '@angular/core';
import { Post } from 'src/app/post/post.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = environment.apiUrl;
  private posts: Post [] = [];
  private postUpdate = new Subject<Post[]>();

  constructor(
    private http: HttpClient
  ) { }

  addPost(form: NgForm) {
    const post: Post = form.value;
    console.log(post);
    this.http.post<{message: string, post: Post}>(`${this.url}/posts`, post)
    .subscribe((data) => {
      console.log(data);
      this.posts.push(post);
      this.postUpdate.next([...this.posts]);
      form.resetForm();
    });
  }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(`${this.url}/posts`)
    .subscribe((data) => {
      this.posts = data.posts;
      this.postUpdate.next([...this.posts]);
    });
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postUpdate.asObservable();
  }

}
