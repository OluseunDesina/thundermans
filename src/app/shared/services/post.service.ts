import { Injectable } from '@angular/core';
import { Post } from 'src/app/post/post.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = environment.apiUrl;
  private posts: Post[] = [];
  private postUpdate = new Subject<{ posts: Post[]; maxLength: number }>();
  private isLoadingListener = new Subject<boolean>();
  private socket: any = io(`http://localhost:3000`);

  constructor(private http: HttpClient, private router: Router) {
    // this.socket = io(`${this.url}`);
  }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  addPost(form, image) {
    let post: Post = form.value;
    const postData = new FormData();
    // postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    console.log(postData);
    console.log(post);
    this.http.post<{ message: string; post: Post }>(`${this.url}/posts`, postData).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', { data: `I just added a post` });
      // post = data.post;
      // this.posts.push(post);
      // this.postUpdate.next([...this.posts]);
      this.router.navigate(['/streams']);
      form.reset();
    });
  }

  getPost(id) {
    return this.http.get<{ post: any; message: string }>(`${this.url}/posts/${id}`);
  }

  getPosts(pageSize, currentPage) {
    const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any[]; maxLength: number }>(`${this.url}/posts${queryParams}`)
      .pipe(
        map(posts => {
          return {
            posts: posts.posts.map(post => {
              return {
                id: post._id,
                ...post
                // title: post.title,
                // content: post.content,
                // imagePath: post.imagePath,
                // user: post.user
              };
            }),
            maxLength: posts.maxLength
          };
        })
      )
      .subscribe(posts => {
        console.log(posts);
        this.posts = posts.posts;
        this.postUpdate.next({ posts: [...this.posts], maxLength: posts.maxLength });
      });
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postUpdate.asObservable();
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(`${this.url}/posts/${id}`);
  }

  updatePost(form, postId) {
    let post: Post | FormData;
    const image = form.value.image;
    if (typeof image === 'object') {
      post = new FormData();
      post.append('id', postId);
      post.append('title', form.value.title);
      post.append('content', form.value.content);
      post.append('image', form.value.image, form.value.title);
    } else {
      post = {
        ...form.value,
        id: postId
      };
      // post = form.value;
    }
    this.http
      .put(`${this.url}/posts/${postId}`, post)
      .subscribe((data: { id: string; imagePath: string; title: string; content: string }) => {
        // this.post
        const updatePost = [...this.posts];
        const oldPostIndex = updatePost.findIndex(p => p.id === postId);
        const newPost: Post = {
          ...form.value,
          id: postId,
          imagePath: data.imagePath
        };
        // updatePost[oldPostIndex] = newPost;
        // this.posts = updatePost;
        // this.postUpdate.next([...this.posts]);
        form.reset();
        this.router.navigate(['/streams']);
        // console.log(data);
      });
  }

  likePost(post, id) {
    return this.http.post<{ post: any; message: string }>(`${this.url}/posts/like/${id}`, post).subscribe(
      data => {
        console.log(data);
        this.socket.emit(`refresh`, {});
      },
      error => {
        console.log(error);
      }
    );
  }
}
