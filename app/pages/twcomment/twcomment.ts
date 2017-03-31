import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController,ToastController } from 'ionic-angular';
import { InAppBrowser} from "ionic-native";

/*
  Generated class for the TwcommentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/twcomment/twcomment.html',
})
export class TwcommentPage {
  private item;
  private loggedinuser;
  public msg:string = '';

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,public toastCtrl: ToastController) {
    this.item=this._navParams.get("item");
    this.loggedinuser=this._navParams.get("loggedinuser");



  }


  goback(){
    this.navCtrl.pop();
  }

  getytsearchkey(msg){
    this.msg = msg;
  }

  posttw(){


    if(this.item.type == 'image') {

      let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+this.item.value+'&page=profile&com='+this.msg+'&userid='+this.loggedinuser+'&type=statImg',  '_blank');
    }else if(this.item.type == 'route') {

      let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+this.item.routes.image_name+'&page=profile&com='+this.msg+'&userid='+this.loggedinuser+'&type='+this.item.type,  '_blank');
    }else if(this.item.type == 'mp4') {

      let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+this.item.value+'&page=profile&com='+this.msg+'&userid='+this.loggedinuser+'&type='+this.item.type,  '_blank');
    }else if(this.item.type == 'youtube') {

      let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+this.item.value+'&page=profile&com='+this.msg+'&userid='+this.loggedinuser+'&type='+this.item.type,  '_blank');
    }else{

      let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+this.item.value+'&page=profile&com='+this.msg+'&userid='+this.loggedinuser+'&type=text',  '_blank');
    }




  }

}
