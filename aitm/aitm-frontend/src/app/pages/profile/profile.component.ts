import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/app/api.service';
import {AppComponent} from 'src/app/app.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileJson: string = null;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private app: AppComponent
  ) {}
  ngOnInit() {
    console.log("open profile")
    this.profileJson = JSON.stringify(JSON.parse(localStorage.getItem("user")), null, 2)
  }
}
