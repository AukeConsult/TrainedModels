import {Component, OnInit} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/services/user.service';
import {Router} from '@angular/router';
import {UserProfile} from "./domain/user";

@Component({
  template: `<p>callback</p>`,
  selector: 'app-callback'
})
export class CallbackComponent implements OnInit {

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {
      console.log("callback constructor")
  }

  ngOnInit(): void {
      console.log("callback on init")
      this.auth.user$.subscribe(
        (profile) => {
            this.userService.saveProfile(profile).then((ret: {
                new?: boolean,
                user?: UserProfile
                err?: any
        })  => {
            console.log(ret)
            if(!ret.err) {
                this.router.navigate(['profile'])
            } else {
                console.error(ret.err.message)
            }
        })
      }
    );
  }
}
