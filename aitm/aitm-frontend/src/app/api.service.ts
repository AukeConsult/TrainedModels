import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../../auth_config.json';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public profileJson: any;

  constructor(private http: HttpClient) {
    this.profileJson = JSON.stringify(JSON.parse(localStorage.getItem("user")), null, 2)
  }

  ping$() {
    return this.http.get(`${config.apiUri}/api/external`);
  }

  logon$(profile: any): any {
    return this.http.post(`${config.apiUri}/api/users/authUser`,profile).toPromise()
      .then(user => {
        console.log(user)
        localStorage.setItem("user", JSON.stringify(user));
        this.profileJson = user;
        return user
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }

}
