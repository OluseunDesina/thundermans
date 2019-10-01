import { Injectable } from '@angular/core';
import { Post } from 'src/app/post/post.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post [] = [];
  private postUpdate = new Subject<Post[]>();

  constructor() { }

  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postUpdate.asObservable();
  }

  addPost(form: NgForm) {
    const post: Post = form.value;
    this.posts.push(post);
    this.postUpdate.next([...this.posts]);
    form.resetForm();
  }
}
