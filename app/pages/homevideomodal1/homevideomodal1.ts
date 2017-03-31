import { Component } from '@angular/core';
import { NavController,NavParams,Platform } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
/*
  Generated class for the HomevideomodalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/homevideomodal1/homevideomodal1.html',
})
export class Homevideomodal1Page {
  private videoid;
  private pwidth;
  private pheight;
  url: SafeResourceUrl;

  constructor(private navCtrl: NavController,private _navParams: NavParams,public platform: Platform,public sanitizer:DomSanitizationService) {
    this.videoid=this._navParams.get("videoid");
    this.pwidth = 480;
    this.pheight = 360;

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.videoid+'?controls=1&autoplay=1&ref=0');

    platform.ready().then((readySource) => {
      this.pwidth = platform.height();
      this.pheight = (parseInt(this.pwidth)*3)/4;
    });

  }



  /*ionViewDidEnter() {
    ScreenOrientation.lockOrientation('landscape');
  }
  onPageWillLeave() {
    ScreenOrientation.unlockOrientation();
  }*/
  goback(){
    this.navCtrl.pop();
  }

  getsantitizedUrl(){
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.videoid+'?controls=1&autoplay=1&ref=0');
  }

  getyoutubecontent(){
    console.log(1111111111);
      var content = '<iframe width="99%" height="99%" src="https://www.youtube.com/embed/XJW4UB83oaY" frameborder="0" allowfullscreen></iframe>';
      //return this.sanitizer.bypassSecurityTrustHtml(content);
    return content;
  }

}
