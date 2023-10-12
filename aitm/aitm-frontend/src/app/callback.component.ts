import {Component, OnInit} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/app/api.service';
import {Router} from '@angular/router';

@Component({
  template: ``,
  selector: 'app-callback'
})
export class CallbackComponent implements OnInit {

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => {
        this.api.logon$({
          userid: profile.email,
          nickname: profile.nickname,
          sub: profile.sub,
          authProfile: profile
        }).then(ret => {
          console.log(ret)
        })
        this.router.navigate(['']);// used for routing after importing Router
      }
    );
  }

}
