import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import config from '../../../../auth_config.json';
import {UserProfile} from "../domain/user";
import {AuthService} from "@auth0/auth0-angular";
import {ErrorService} from "./error.service";

@Injectable({providedIn: 'root'})
export class UserService {

    public newuser: boolean
    public userProfile: UserProfile = undefined

    constructor(private http: HttpClient,
                private auth: AuthService,
                private error: ErrorService
    ) {

        const u = localStorage.getItem("user")
        if(u && u != "undefined") {
            this.userProfile = JSON.parse(localStorage.getItem("user"))
        }
        if(this.userProfile==null) {
            this.logout()
        }
        console.log(this.userProfile)
    }
    ping$() {
        return this.http.get(`${config.apiUri}/api/external`);
    }
    canEdit(userId: string): boolean {
        return userId == this.userProfile.userid
    }
    saveProfile(authProfile: any): any {

        return this.http.post(`${config.apiUri}/api/user/authuser`, authProfile)
            .toPromise().then((ret: {newuser: boolean, user: UserProfile}) =>
            {

                this.userProfile = ret.user;
                this.newuser = ret.newuser;
                localStorage.setItem("user", JSON.stringify(this.userProfile));
                console.log(this.userProfile)

                return {
                    new: ret.newuser,
                    user: this.userProfile
                }

            }).catch(err => {
                this.error.addError(err)
                return {err: err}
            }
        )
    }
    logout() {
        console.log('log out')
        this.userProfile=null
        localStorage.removeItem("user")
    }
}
