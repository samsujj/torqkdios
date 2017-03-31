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

@Component({
  templateUrl: 'build/pages/ytvdolist/ytvdolist.html',
})
export class YtvdoListPage {
  private local:LocalStorage;
  private serachkey;
  private videolist;
  private totalvideo;
  private videoindex;
  private noofvideo;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService,public modalCtrl: ModalController,public viewCtrl: ViewController) {
    this.serachkey=this._navParams.get("searchkey");
    this.videoindex = 0;
      this.videolist = [];

      console.log(this.serachkey);


    var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+this.serachkey+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';


    this._http.get(dataurl)
        .subscribe(data => {

          var res = data.json();

          this.totalvideo = res.pageInfo.totalResults;

            var items = res.items;

            for(let nn in items){
                var value = items[nn];
                if(typeof (value.id.videoId) != 'undefined'){
                    this.videolist.push(value);
                }
            }

            this.noofvideo = this.videolist.length;

            console.log(this.videolist);

        }, error => {
          console.log("Oooops!");
        });




  }

  goback(){
    this.navCtrl.pop();
  }


    addYtVideo(id){
    let data = { 'videoid': id };
    this.viewCtrl.dismiss(data);
  }

    launchVideo1(videoid) {

        let modal = this.modalCtrl.create(Homevideomodal1Page, {
            "videoid": videoid
        });
        modal.present();
    }



}
