import { Component, Inject } from '@angular/core';
import { faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  isCollapsed = true;
  faUser = faUser;
  faPowerOff = faPowerOff;

  constructor(
    public auth: AuthService,
    private userService: UserService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  loginWithRedirect() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/callback',
      },
    });
    console.log(this.auth.user$)
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
    this.userService.logout()

  }
}
