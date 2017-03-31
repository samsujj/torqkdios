import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {DomSanitizationService} from "@angular/platform-browser";
import {ForumDetailsPage} from "../forumdetails/forumdetails";

/*
  Generated class for the TopicmovePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/topicmove/topicmove.html',
})
export class TopicmovePage {
  private topicid;
  private forumlist;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService) {
    this.topicid=this._navParams.get("topicid");

    var link = 'http://torqkd.com/user/ajs2/getAllForumList';
    var data = {id: this.topicid};


    this._http.post(link, data)
        .subscribe(data1 => {
          this.forumlist = data1.json();
        }, error => {
          console.log("Oooops!");
        });

  }

  goback(){
    this.navCtrl.pop();
  }

  changeRadio(ev){
    var link = 'http://torqkd.com/user/ajs2/moveTopic';
    var data = {topicId: this.topicid , forumId : ev};


    this._http.post(link, data)
        .subscribe(data1 => {
          this.navCtrl.push(ForumDetailsPage, {
            id: ev
          });
        }, error => {
          console.log("Oooops!");
        });
  }

}
