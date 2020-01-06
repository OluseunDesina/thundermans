import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  private socket: any = io(`http://localhost:3000`);
  private url = environment.apiUrl;
  posts: any[] = [];
  private postSub: Subscription;
  isLoading = false;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  totalPosts = 10;
  currentPage = 1;
  userIsAuth: boolean;
  userId: string;
  username: string;

  constructor(private postService: PostService, private authService: AuthService) {
    // this.socket = io(`http://localhost:3000`);
  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.username = localStorage.getItem('username');
    this.userIsAuth = this.authService.getIsAuth();
    this.authService.getIsAuthListener().subscribe(isAuthenticated => {
      this.userIsAuth = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
    this.getPosts();
    this.socket.on('refreshPage', data => {
      console.log(`refresh Page`);
      console.log(data);
      this.getPosts();
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  getPosts() {
    this.postService.getPosts(this.pageSize, this.currentPage);
    this.postSub = this.postService.getPostUpdateListener().subscribe((data: { posts: Post[]; maxLength: number }) => {
      this.isLoading = false;
      this.totalPosts = data.maxLength;
      this.posts = data.posts;
      console.log(this.posts);
    });
  }

  checkUserInLikes(likes: any[]) {
    return _.some(likes, { username: this.username });
  }

  onLikePost(post) {
    console.log(post);
    this.postService.likePost(post, post.id);
  }

  onDelete(id) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(
      data => {
        this.postService.getPosts(this.pageSize, this.currentPage);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(value: PageEvent) {
    this.isLoading = true;
    console.log(value);
    this.currentPage = value.pageIndex + 1;
    this.pageSize = value.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }
}
