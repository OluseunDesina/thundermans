import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  posts: Post[] = [];
  private postSub: Subscription;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postService.getPostUpdateListener()
    .subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

}
