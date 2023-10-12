import {Component, Injectable, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public api: ApiService
  ) {}
  ngOnInit() {}
}