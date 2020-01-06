import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { StreamsComponent } from './streams/streams/streams.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';

const routes: Routes = [
  // { path: '', component: PostListComponent },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{ path: '', loadChildren: './auth/auth.module#AuthModule' }]
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      { path: 'add-post', component: PostCreateComponent, canActivate: [AuthGuard] },
      { path: 'edit/:id', component: PostCreateComponent, canActivate: [AuthGuard] },
      { path: 'streams', component: StreamsComponent, canActivate: [AuthGuard] }
      // { path: '**', component: PostListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
