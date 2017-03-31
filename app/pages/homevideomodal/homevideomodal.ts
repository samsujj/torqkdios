import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';
import {ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions} from 'ionic-native';
//import * as $ from "jquery";
import { Transfer } from 'ionic-native';
import { MediaCapture } from 'ionic-native';
import {File} from 'ionic-native';
import { SocialSharing } from 'ionic-native';
import {InAppBrowser} from 'ionic-native';
import {StreamingMedia, StreamingVideoOptions} from 'ionic-native';
import { Camera } from 'ionic-native';

import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';

/*
  Generated class for the HomevideomodalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/homevideomodal/homevideomodal.html',
})
export class HomevideomodalPage {
  private poster;
  private videourl;

  public autoplay = true;

  constructor(private navCtrl: NavController,private _navParams: NavParams,public sanitizer:DomSanitizationService) {
    this.poster=this._navParams.get("poster");
    this.videourl=this._navParams.get("url");

    /*let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape'
    };

    StreamingMedia.playVideo(this.videourl, options);*/

  }


/*
  ionViewDidEnter() {
    ScreenOrientation.lockOrientation('landscape');
  }
  onPageWillLeave() {
    ScreenOrientation.unlockOrientation();
  }*/
  goback(){
    this.navCtrl.pop();
  }

}
