import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {DomSanitizationService} from "@angular/platform-browser";
import {HomePage} from '../home/home';

@Component({
  templateUrl: 'build/pages/userblocklist/userblocklist.html',
})
export class UserblockListPage {
  private local:LocalStorage;
  private loggedinuser;
  private items;
  private serachkey = '';

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService) {
    this.items=this._navParams.get("items");

    console.log(this.items);

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
      }else{
        this.navCtrl.push(HomePage);
      }
    }).catch((err)=>{
      this.navCtrl.push(HomePage);
    });

  }


  goback(){
    this.navCtrl.pop();
  }

  blockpeople(item){
    var idx1 = this.items.indexOf(item);
    var link = 'http://torqkd.com/user/ajs2/blockpeople';
    var data = {cuser: this.loggedinuser,uid: item.id};


    this._http.post(link, data)
        .subscribe(data => {
          this.items.splice(idx1,1);
        }, error => {
          console.log("Oooops!");
        });
  }



}
