import { Component } from '@angular/core';
import {NavController, NavParams,ModalController,ViewController} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {DomSanitizationService} from "@angular/platform-browser";
import {HomePage} from '../home/home';
import {UserblockListPage} from '../userblocklist/userblocklist';
import {Homevideomodal1Page} from "../homevideomodal1/homevideomodal1";
import {FriendsProfilePage} from "../friendsprofile/friendsprofile";

@Component({
  templateUrl: 'build/pages/sportspeople/sportspeople.html',
})
export class SportspeoplePage {
  private local:LocalStorage;
  private sportsid;
  private userlist;
  public friendsprofilepage = FriendsProfilePage;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService,public modalCtrl: ModalController,public viewCtrl: ViewController) {
    this.sportsid=this._navParams.get("id");

    /***************sp user list [start]********************/
    var link211 = 'http://torqkd.com/user/ajs2/spUserList';
    var data211 = {spId:this.sportsid};



    this._http.post(link211, data211)
        .subscribe(res211 => {
          this.userlist=res211.json();
        }, error => {
          console.log("Oooops!");
        });
    /***************sp user list [end]********************/


  }

  goback(){
    this.navCtrl.pop();
  }




}
