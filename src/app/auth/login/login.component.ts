import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

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

  onLogin(form: NgForm) {
    // console.log(form.value);
    this.isLoading = true;
    this.authService.login(form);
  }


}
