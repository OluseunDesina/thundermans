import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  private authStatusSub: Subscription;
  form: FormGroup;

  post: Post = {
    id: null,
    title: '',
    content: '',
    imagePath: '',
    user: null,
  };
  mode = 'create';
  isLoading = true;
  imageUrl;


  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getIsLoadingListener()
    .subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.form = new FormGroup({
      // title: new FormControl(null, {
      //   validators: [Validators.required, Validators.minLength(3)]
      // }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [MimeType]
      }),
    });
    this.isLoading = false;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        this.post.id = paramMap.get('id');
        this.mode = 'edit';
        this.postService.getPost(this.post.id)
        .subscribe((post) => {
          this.isLoading = false;
          this.form.setValue({
            // title: post.post.title,
            content: post.post.content,
            image: post.post.imagePath
          });
          this.post.id = post.post._id;
          // this.post.title = post.post.title;
          this.post.content = post.post.content;
        });
      } else {
        this.mode = 'create';
        this.post.id = null;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    // if (this.form.invalid) {
    //   return;
    // }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.onSubmit();
    } else if (this.mode === 'edit') {
      this.onUpdate();
    }
  }

  onSubmit() {
    this.postService.addPost(this.form, this.form.value.image);
    this.isLoading = false;
  }

  onUpdate() {
    this.postService.updatePost(this.form, this.post.id);
    this.isLoading = false;
  }

}
