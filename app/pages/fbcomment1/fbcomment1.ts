import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController,ToastController } from 'ionic-angular';

/*
  Generated class for the FbcommentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/fbcomment1/fbcomment1.html',
})
export class Fbcomment1Page {
  private item;
  private accessToken;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,public toastCtrl: ToastController) {
    this.item=this._navParams.get("item");
    this.accessToken=this._navParams.get("accessToken");



  }


  goback(){
    this.navCtrl.pop();
  }

  postfb(){
    var fbcom = $('#fbcom textarea').val();

    if(this.item.type == 'mp4'){
         var link = 'http://torqkd.com/user/ajs2/postfbvideo';
         var data = {'accessToken':this.accessToken,'com':fbcom,'value':this.item.value};
     }else if(this.item.type == 'youtube'){
         var link = 'http://torqkd.com/user/ajs2/postfbYtvideo';
         var data = {'accessToken':this.accessToken,'com':fbcom,'value':this.item.value};
     }

     this._http.post(link, data)
     .subscribe(res => {
       let toast = this.toastCtrl.create({
         message: 'Posted Successfully On Facebook',
         duration: 3000,
           position : 'middle',
           cssClass : 'social-share-success'
       });

         toast.onDidDismiss(() => {
             this.navCtrl.pop();
         });

       toast.present();



     }, error => {
       let toast = this.toastCtrl.create({
         message: 'An Error occured in FB Share',
         duration: 3000,
           position : 'middle',
           cssClass : 'social-share-success'
       });

         toast.onDidDismiss(() => {
             this.navCtrl.pop();
         });
       toast.present();
     });


  }

}
