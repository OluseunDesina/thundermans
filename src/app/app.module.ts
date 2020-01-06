import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app.routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error/error-interceptor';
import { ErrorComponent } from './error/error/error.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StreamsComponent } from './streams/streams/streams.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    AuthLayoutComponent,
    SidebarComponent,
    HeaderComponent,
    ErrorComponent,
    PostCreateComponent,
    PostListComponent,
    StreamsComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [ErrorComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
