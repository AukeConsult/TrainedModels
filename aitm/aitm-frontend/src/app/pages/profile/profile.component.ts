import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

    public userProfile;
    public canedit: boolean
    public newuser: boolean = false

    constructor(
        public userService: UserService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get("id");
        if(!id) {
            this.userProfile=this.userService.userProfile
            this.newuser = this.userService.newuser
            this.canedit=true;
        } else {
            // read user
        }
  }
}
