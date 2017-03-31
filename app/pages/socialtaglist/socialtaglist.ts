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
  templateUrl: 'build/pages/socialtaglist/socialtaglist.html',
})
export class socialtaglistPage {
  public  items;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService) {
    this.items=this._navParams.get("item");
    console.log(this.items);


  }

  goback(){
    console.log('dfdsf');
    this.navCtrl.pop();
  }


}
