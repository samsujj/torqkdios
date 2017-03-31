import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {DomSanitizationService} from "@angular/platform-browser";

/*
  Generated class for the SocialcommentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/tagpeoplelist/tagpeoplelist.html',
})
export class tagpeoplelistPage {
  public  tagpeople = [];
  public  userList;
  private loggedinuser;
  private local:LocalStorage;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService) {

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;
    });


    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var link = 'http://torqkd.com/user/ajs2/alluserList';
    var data = {sess_id: this.loggedinuser};

    this._http.post(link, data)
        .subscribe(data => {
          this.userList = data.json();
        }, error => {
          console.log("Oooops!");
        });

  }



  goback(){
    this.local = new Storage(LocalStorage);
    this.local.set('tagpeoplelist', JSON.stringify(this.tagpeople));
    this.navCtrl.pop();
  }

  handleChange(event,uid){
    if(event._checked){
      this.tagpeople.push(uid);
    }else{
      var idx = this.tagpeople.indexOf(uid);
      this.tagpeople.splice(idx,1);
    }
  }


}
