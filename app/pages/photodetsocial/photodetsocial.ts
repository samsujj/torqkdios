import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {PhotocommentsocialPage} from "../photocommentsocial/photocommentsocial";
import {Facebook} from 'ionic-native';
import {Fbcomment2Page} from "../fbcomment2/fbcomment2";
import {TwcommentPage} from "../twcomment/twcomment";
import { ActionSheetController,ToastController } from 'ionic-angular';
import { InAppBrowser} from "ionic-native";

/*
  Generated class for the PhotodetsocialPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/photodetsocial/photodetsocial.html',
})
export class PhotodetsocialPage {
  private itemdet;
  private loggedinuser;
  private local:LocalStorage;
  private accessToken;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController) {
    this.itemdet=this._navParams.get("item");

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
      }else{
        this.loggedinuser = 0;
      }
    });
  }

  goback(){
    this.navCtrl.pop();
  }

  updatelike(itemid){
    if(this.loggedinuser > 0){
      var link1 = 'http://torqkd.com/user/ajs2/likestatus/id/'+itemid+'/userid/'+this.loggedinuser;
      var data1 = {userid :this.loggedinuser};

      this._http.post(link1,data1)
          .subscribe(data => {
            if(data.json()==null){
              return;
            }
            else{
              this.itemdet.is_like = data.json().is_like;
              this.itemdet.like_no = data.json().like_no;
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }

  showComment(item){
    var link1 = 'http://torqkd.com/user/ajs2/getStatusComment';
    var data1 = {id : item.id};

    this._http.post(link1,data1)
        .subscribe(data => {
          if(data.json()==null){
            return;
          }
          else{
            item.commentList = data.json();
          }

          let modal = this.modalCtrl.create(PhotocommentsocialPage, {
            "item": item,
          });

          modal.present();

        }, error => {
          console.log("Oooops!");
        });


  }

  showSocilaShareList(item){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share',
      cssClass : 'socilashareactionsheet',
      buttons: [
        {
          text: '',
          handler: () => {
            Facebook.login(["email","public_profile"]).then((result) => {

              if(result.status == 'connected'){
                this.accessToken = result.authResponse.accessToken;

                if(item.is_status == 1){
                  var obj = {
                    method: "share",
                    href: 'http://torkq.com/singlepost.php?id='+this.loggedinuser+'&image='+item.value,
                    display : 'popup'
                  };
                  Facebook.showDialog(obj).then((res) => {
                    let toast = this.toastCtrl.create({
                      message: 'Posted Successfully On Facebook',
                      duration: 3000
                    });

                    toast.onDidDismiss(() => {
                      this.navCtrl.pop();
                    });

                    toast.present();
                  });
                }else{
                  var obj = {
                    method: "share",
                    href: 'http://torkq.com/singlepost.php?id='+this.loggedinuser+'&image1='+item.value,
                    display : 'popup'
                  };
                  Facebook.showDialog(obj).then((res) => {
                    let toast = this.toastCtrl.create({
                      message: 'Posted Successfully On Facebook',
                      duration: 3000
                    });

                    toast.onDidDismiss(() => {
                      this.navCtrl.pop();
                    });

                    toast.present();
                  });
                }






              }else{
                alert('An Error occured in FB Login');
              }
            });
          }
        },
        {
          text: '',
          handler: () => {

            var sType = 'text';
            if(item.is_status == 1){
              sType = 'statImg';
            }
            if(item.is_status == 0){
              sType = 'commImg';
            }

            var inAppBrowserRef;

           // inAppBrowserRef = InAppBrowser.open('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com=&userid='+this.loggedinuser+'&type=statImg',  '_blank', 'location=no');

            let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com=&userid='+this.loggedinuser+'&type=statImg', '_blank');

          }
        },
        {
          text: '',
          handler: () => {
            var inAppBrowserRef;
           // inAppBrowserRef = InAppBrowser.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.img_src+'&description=',  '_blank', 'location=no');

            let browser = new InAppBrowser('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.img_src+'&description=', '_blank');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


}
