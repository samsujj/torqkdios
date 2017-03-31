import { Component } from '@angular/core';
import { NavController,NavParams,LoadingController } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';
import {Http, Headers} from "@angular/http";

/*
  Generated class for the HomevideomodalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/commonpopup/commonpopup.html',
})
export class CommonPopupPage {
  private type;
  private content;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public loadingCtrl: LoadingController) {
    this.type=this._navParams.get("type");


    var link = 'http://torqkd.com/user/ajs2/getTermsNpolicy/type/'+this.type;
    var data = {type: this.type};

    this._http.post(link, data)
        .subscribe(res => {
          this.content = res.text();
        }, error => {
          console.log("Oooops!");
        });


  }

  goback(){
    this.navCtrl.pop();
  }

}
