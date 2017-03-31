import {Component, OnInit} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {LoginPage} from  '../login/login';
import { Storage, LocalStorage,ModalController } from 'ionic-angular';
import {ProfilePage} from '../profile/profile'
import {HomevideomodalPage} from '../homevideomodal/homevideomodal'
import {Splashscreen} from 'ionic-native';
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {ExperiencePage} from "../experience/experience";
import {SignupPage} from "../signup/signup";
import {SignupnextPage} from "../signupnext/signupnext";
import {SignupaddimagePage} from "../signupaddimage/signupaddimage";

///import {} from 'ionic-native';
//import {StreamingMedia} from 'ionic-native';
//import {StreamingMedia, StreamingVideoOptions} from 'ionic-native';
import * as $ from "jquery";

import { SQLite } from 'ionic-native';

//import {ROUTER_DIRECTIVES, Router, Location} from "angular2/router";

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private local:LocalStorage;
  loginPage=LoginPage;
  profilePage=ProfilePage;
  homevideomodal=HomevideomodalPage;
  private isloggedin:boolean=false;
  //private router:Router;
  public experiencepage = ExperiencePage;
  public signuppage = SignupPage;
  public signupnextpage = SignupnextPage;
  public signupaddimagepage = SignupaddimagePage;

  constructor(private navCtrl: NavController ,public modalCtrl: ModalController , public  platform: Platform) {
    //this.local=null;



    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 10);
    }

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      //alert(value)
      if(value!=null) {

        //this.navpage();
        this.isloggedin=true;

        //return;
        // /$('.exp').click();
        //alert(value);
        //this.router.navigate(['<aliasInRouteConfig>']);
      }
      else{
        $('.has-header').removeClass('hide');
      }
    });

    this.platform.registerBackButtonAction(function(){

      this.platform.exitApp();
    },500);



  
  }

  openvideoplayer() {
    let modal = this.modalCtrl.create(HomevideomodalPage,{"url": "http://m.torkq.com/video/Torkq_LR_061416.mp4","poster":"http://m.torkq.com/images/tork_img2.jpg"});
    modal.present();


    //window.plugins.streamingMedia.playVideo(videoUrl);




    // Create a MediaPlugin instance.  Expects path to file or url as argument
    /*var file = new MediaPlugin('http://m.torkq.com/video/Torkq_LR_061416.mp4');

// Catch the Success & Error Output
// Platform Quirks
// iOS calls success on completion of playback only
// Android calls success on completion of playback AND on release()
    file.init.then(() => {
      file.play();
      Toast.show("I'm  for success", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
      );
    }, (err) => {
      Toast.show("I'm   for error", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
      );
    });

// play the file
    file.play();
    // let profileModal = this.modalCtrl.create(HomevideomodalPage, { userId: 8675309 });
    // profileModal.present();
*/

  }


  ionViewDidEnter() {

    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 10);
    }

    if(this.isloggedin)this.navCtrl.setRoot(ProfilePage);

  }

  public navpage(){
    console.log('nav methi called');
    this.navCtrl.setRoot(ProfilePage);

  }
  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }





}

