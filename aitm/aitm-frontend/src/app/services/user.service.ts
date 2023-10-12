import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import config from '../../../../auth_config.json';
import {UserProfile} from "../domain/user";

@Injectable({providedIn: 'root'})
export class UserService {

    public newuser: boolean
    public userProfile: UserProfile = undefined

    constructor(private http: HttpClient) {
        const u = localStorage.getItem("user")
        if(u && u != "undefined") {
            this.userProfile = JSON.parse(localStorage.getItem("user"))
        } else {
            localStorage.removeItem("user")
        }
    }
    ping$() {
        return this.http.get(`${config.apiUri}/api/external`);
    }
    canEdit(userId: string): boolean {
        return userId == this.userProfile.userid
    }
    saveProfile(authProfile: any): any {

        return this.http.post(`${config.apiUri}/api/users/authUser`, authProfile)
            .toPromise().then((ret: {newuser: boolean, userProfile: UserProfile}) =>
            {

              this.userProfile = ret.userProfile;
              this.newuser = ret.newuser;

              localStorage.setItem("user", JSON.stringify(this.userProfile));

              return {
                  new: ret.newuser,
                  user: this.userProfile
              }

            }).catch(err => {
                return {err: err}
            }
        )
    }
    logout() {
        this.userProfile=undefined
        localStorage.removeItem("user")
    }
}
