import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {
  private token;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.token = this.auth.getToken();
    // console.log(this.token);
  }
}
