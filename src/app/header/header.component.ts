import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthSubs: Subscription;
  userIsAuth = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuth = this.authService.getIsAuth();
    this.isAuthSubs = this.authService.getIsAuthListener()
    .subscribe((isAuth) => {
      this.userIsAuth = isAuth;
    });
  }

  ngOnDestroy() {
    this.isAuthSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logOut();
  }

}
