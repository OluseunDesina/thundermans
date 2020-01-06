import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getIsLoadingListener()
    .subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.register(form);
  }

}
