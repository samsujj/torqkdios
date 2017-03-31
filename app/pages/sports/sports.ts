import { Component } from '@angular/core';
import { Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ToastController ,AlertController,ActionSheetController,Slides,MenuController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {Http, Headers} from "@angular/http";

import {SportsEventPage} from "../sportsevent/sportsevent";
import {SportsGroupPage} from "../sportsgroup/sportsgroup";
import {SportsStatPage} from "../sportsstat/sportsstat";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {PhotodetsocialPage} from "../photodetsocial/photodetsocial";
import {Homevideomodal1Page} from "../homevideomodal1/homevideomodal1";
import {SocialcommentPage} from "../socialcomment/socialcomment";
import {FbcommentPage} from "../fbcomment/fbcomment";
import {TwcommentPage} from "../twcomment/twcomment";
import {TorqkdtvPage} from "../torqkdtv/torqkdtv";
import {PhotoPage} from "../photo/photo";
import {SportspeoplePage} from "../sportspeople/sportspeople";
import {
  Splashscreen, InAppBrowser, YoutubeVideoPlayer, StreamingMedia, StreamingVideoOptions, Facebook,
  SQLite, Network
} from "ionic-native";
import {FriendsProfilePage} from "../friendsprofile/friendsprofile";
import {RouteDetailsPage} from '../routedetails/routedetails';
import {HomevideomodalPage} from '../homevideomodal/homevideomodal'

import { ViewChild } from '@angular/core';


/*
  Generated class for the SportsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/sports/sports.html',
})
export class SportsPage {

  @ViewChild('mySlider') slider: Slides;

    mySlideOptions5 = {
        initialSlide: 0,
        loop: true,
        autoplay:5000,
        direction : 'vertical'
    };
    mySlideOptions1 = {
        initialSlide: 0,
        loop: true,
        autoplay:4000
    };

  mySlideOptions2 = {
  initialSlide: 0,
  loop: true,
  autoplay:4000
};

  mySlideOptions3 = {
    initialSlide: 0,
    loop: true,
    autoplay:4000
  };

  private sportdet;


  public sportspage = SportsPage;
  public sportseventpage = SportsEventPage;
  public sportsgrouppage = SportsGroupPage;
  public sportsstatpage = SportsStatPage;

  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private sportsid;
  private spdescription;
  private isExpanded = 0;
  public banner1data;
  public banner2data;

  private loggedinuser;
  private local:LocalStorage;
  public autoplay = true;
  private torqkdtvpage = TorqkdtvPage;
  private photopage = PhotoPage;
  public friendsprofilepage = FriendsProfilePage;

  private cdatetime;

  private socialfeedoffset;
  private statusdata;

  private accessToken;

    private spimagelist;
    private spimagelistlength;

  private isInternet;
  public isOfflineData;


  constructor(private navCtrl: NavController,private _navParams: NavParams,public platform: Platform,private _http: Http ,public modalCtrl: ModalController ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController, private sanitizer:DomSanitizationService,public menu: MenuController) {
    this.sportsid=this._navParams.get("id");


    this.cdatetime = (new Date).getTime();

    this.socialfeedoffset=0;

    this.local = new Storage(LocalStorage);



    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;

      this.getstatus();
      if(value!=null) {
        console.log(1);
      }
      else{
        $('ion-content').removeClass('hide');
      }
    }).catch((err)=>{
      this.loggedinuser = 0;
      this.getstatus();
    });


    this.getsportDet();
    this.getgetProfilebanners();
    this.getspImagelist();


    /************************Check Internet [start]*****************************/
    this.platform.ready().then(() => {

      if(Network.connection === 'none'){
        this.isInternet = 0;
      }else{
        this.isInternet = 1;
      }
      this.isOfflineData = 0;
      this.checkOfflineData();

      let disconnectSubscription = Network.onDisconnect().subscribe(() => {
        this.isInternet = 0;
      });

      let connectSubscription = Network.onConnect().subscribe(() => {
        this.isInternet = 1;
      });

    });
    /************************Check Internet [end]*******************************/


  }


  getsportDet(){
    /************************sports details[start]***********************/
    var link2 = 'http://torqkd.com/user/ajs2/sportDet';
    var data2 = {id: this.sportsid};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.sportdet=res2.json();
          var spdescrip = this.sportdet.sport_det.sport_desc;

          this.spdescription = spdescrip.substring(0, 200);
        }, error => {
          console.log("Oooops!");
        });
    /************************sports details[end]***********************/
  }

  getgetProfilebanners(){
    /***************banner slider [start]********************/
    var link21 = 'http://torqkd.com/user/ajs2/getProfilebanners';
    var data21 = {pageid: 2,sp_id:this.sportsid};



    this._http.post(link21, data21)
        .subscribe(res21 => {
          this.banner1data=res21.json().banner1;
          this.banner2data=res21.json().banner2;
        }, error => {
          console.log("Oooops!");
        });
    /***************banner slider [end]********************/
  }

  getspImagelist(){
    /***************sp image [start]********************/
    var link211 = 'http://torqkd.com/user/ajs2/spImagelist';
    var data211 = {id:this.sportsid};



    this._http.post(link211, data211)
        .subscribe(res211 => {
          this.spimagelist=res211.json();
          this.spimagelistlength = this.spimagelist.length;
        }, error => {
          console.log("Oooops!");
        });
    /***************sp image [end]********************/
  }

  openmenu(){
    //$('.navmenul').click();
    this.menu.toggle();
  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  launch(url){
    let browser = new InAppBrowser(url, '_system');
  }

  moredesp(){
    this.isExpanded = 1;
    this.spdescription = this.sportdet.sport_det.sport_desc;
  }
  lessdesp(){
    this.isExpanded = 0;
    var spdescrip = this.sportdet.sport_det.sport_desc;

    this.spdescription = spdescrip.substring(0, 200);
  }

  getstatus(){
    var link1 = 'http://torqkd.com/user/ajs2/getSpStatus';
    var data1 = {sess_user :this.loggedinuser ,sp_id: this.sportsid,offset:this.socialfeedoffset};



    this._http.post(link1, data1)
        .subscribe(data => {

          if(this.socialfeedoffset>0)
            this.statusdata=this.statusdata.concat(data.json().status);
          else this.statusdata=(data.json().status);

        //  this.loadmaps1(this.statusdata);
          this.socialfeedoffset+=5;
        }, error => {
          console.log("Oooops!");
        });
  }

  loadmaps1(statusd){
    setTimeout(function () {

      var x;
      let map = new Array();
      let poly = new Array();
      let locations = new Array();
      let points = new Array();
      let path = new Array();
      let address = new Array();
      let markers = new Array();
      let bounds = new Array();
      let markerp = new Array();
      let marker;

      for (x in statusd) {
        bounds[statusd[x].id] = new google.maps.LatLngBounds();
        if (statusd[x].type == 'route') {

          locations[statusd[x].id]=(statusd[x].routes.location);
          markerp[statusd[x].id]=(statusd[x].routes.marker);


          var myOptions = {
            zoom: 10,
            center: new google.maps.LatLng(52.21454000000001, 0.14044490000003407),
            mapTypeId: google.maps.MapTypeId.HYBRID,
            scrollwheel:false,
            mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE]
            },
            disableDefaultUI: true
          }

          var elems = document.getElementsByClassName('map-canvas-sport'+statusd[x].id);
          var elemlength = elems.length;

          map[statusd[x].id] = new google.maps.Map(elems[elemlength-1], myOptions);


          poly[statusd[x].id] = new google.maps.Polyline({
            geodesic: true,
            strokeColor: '#F7931E',
            strokeOpacity: 1.0,
            strokeWeight: 4
          });

          var n;
          path[statusd[x].id] = new google.maps.MVCArray();

          if(locations[statusd[x].id].length>0)
          {
            for(n in locations[statusd[x].id]){
              var stptggg = locations[statusd[x].id][n];
              var setcarr = new Array();

              var curP = new google.maps.LatLng(locations[statusd[x].id][n]['latitude'] , locations[statusd[x].id][n]['longitude']);

              bounds[statusd[x].id].extend(curP);

              path[statusd[x].id].push(curP);
              if(path[statusd[x].id].getLength() === 1) {
                poly[statusd[x].id].setPath(path[statusd[x].id]);
                map[statusd[x].id].setCenter(curP);
                marker = new google.maps.Marker({
                  map: map[statusd[x].id],
                  position: curP,
                  icon:'http://torqkd.com/images/map-icon.png',
                  //title:address[statusd[x].id]
                });
              }
            }

            poly[statusd[x].id].setMap(map[statusd[x].id]);

          }

          else {
            var curP = new google.maps.LatLng(markerp[statusd[x].id][0]['latitude'], markerp[statusd[x].id][0]['longitude']);


            bounds[statusd[x].id].extend(curP);
            marker = new google.maps.Marker({
              map: map[statusd[x].id],
              position: curP,
              icon:'http://torqkd.com/images/map-icon.png',
              //title:address[statusd[x].id]
            });
          }
          map[statusd[x].id].fitBounds(bounds[statusd[x].id]);
          map[statusd[x].id].setZoom( map[statusd[x].id].getZoom());
          google.maps.event.trigger(map[statusd[x].id], 'resize');

        }
      }
    },5000);

  }

  showtagPeople1(item){
    let modal = this.modalCtrl.create(socialtaglistPage, {
      "item": item.tagpeople,
    });

    modal.present();

  }

  delstatus(item){
    let confirm = this.alertCtrl.create({
      title: '',
      message: 'Are you sure delete this post?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.delstatusconfirm(item);
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    });
    confirm.present();
  }

  delstatusconfirm(item){
    var idx1 = this.statusdata.indexOf(item);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var link = 'http://torqkd.com/user/ajs2/delstatus';
    var data = {status_id: item.id};


    this._http.post(link, data)
        .subscribe(data => {
          this.statusdata.splice(idx1,1);
          this.socialfeedoffset = parseInt(this.socialfeedoffset)-1;
        }, error => {
          console.log("Oooops!");
        });
  }

  showPhotoDetails(item){
    let modal = this.modalCtrl.create(PhotodetsocialPage, {
      "item": item,
    });

    modal.present();

  }
  showRouteDetails(item){
    let modal = this.modalCtrl.create(RouteDetailsPage, {
      "item": item.routes,
    });

    modal.present();

  }
  launchVideo(url,poster) {
    let options: StreamingVideoOptions = {
      successCallback: () => {  },
      errorCallback: (e) => {  },
      orientation: 'landscape'
    };

    StreamingMedia.playVideo("http://torqkd.com/uploads/video/converted/"+url, options);

    /*


     let modal = this.modalCtrl.create(HomevideomodalPage, {
     "url": "http://torqkd.com/uploads/video/converted/"+url,
     "poster": poster
     });

     modal.present();*/
  }
  launchVideo1(videoid) {

    let modal = this.modalCtrl.create(Homevideomodal1Page, {
      "videoid": videoid
    });
    modal.present();
  }

  toogleComment(item){
    let modal = this.modalCtrl.create(SocialcommentPage, {
      "item": item,
    });

    modal.present();
    //}

  }

  updatelike(itemid){
    console.log(itemid);

    var link1 = 'http://torqkd.com/user/ajs2/likestatus/id/'+itemid+'/userid/'+this.loggedinuser;
    var data1 = {userid :this.loggedinuser};



    this._http.post(link1,data1)
        .subscribe(data => {
          if(data.json()==null){
            return;
          }
          else{
            var x;
            for(x in this.statusdata){
              if(this.statusdata[x].id==itemid){
                this.statusdata[x].is_like=data.json().is_like;
                this.statusdata[x].like_no=data.json().like_no;
              }

            }
          }
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
                if(item.type == 'image'){
                  var obj = {
                    method: "share",
                    href: 'http://torkq.com/singlepost.php?id='+this.loggedinuser+'&image='+item.value,
                    display : 'popup'
                  };
                  Facebook.showDialog(obj).then((res) => {
                    let toast = this.toastCtrl.create({
                      message: 'Posted Successfully On Facebook',
                      duration: 3000,
                      position : 'middle',
                      cssClass : 'social-share-success'
                    });


                    toast.present();
                  });
                }else if(item.type == 'route'){
                  alert('route');
                }else if(item.type == 'mp4'){
//                                    var link = 'http://torqkd.com/user/ajs2/postfbvideo';
//                                    var data = {'accessToken':this.accessToken,'com':item.msg,'value':item.value};
                  let modal = this.modalCtrl.create(FbcommentPage, {
                    "item": item, "accessToken" : this.accessToken
                  });

                  modal.present();

                }else if(item.type == 'youtube'){
//                                    var link = 'http://torqkd.com/user/ajs2/postfbYtvideo';
//                                    var data = {'accessToken':this.accessToken,'com':item.msg,'value':item.value};
                  let modal = this.modalCtrl.create(FbcommentPage, {
                    "item": item, "accessToken" : this.accessToken
                  });

                  modal.present();
                }else{
                  var link = 'http://torqkd.com/user/ajs2/postfbText';
                  var data = {'accessToken':this.accessToken,'com':item.msg,'value':item.value};

                  this._http.post(link, data)
                      .subscribe(res => {
                        let toast = this.toastCtrl.create({
                          message: 'Posted Successfully On Facebook',
                          duration: 3000,
                          position : 'middle',
                          cssClass : 'social-share-success'
                        });
                        toast.present();
                      }, error => {
                        let toast = this.toastCtrl.create({
                          message: 'An Error occured in FB Share',
                          duration: 3000,
                          position : 'middle',
                          cssClass : 'social-share-success'
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
            if(item.type == 'image'){
              sType = 'statImg';
            }

            var inAppBrowserRef;

            if(item.type == 'image'){
              let modal = this.modalCtrl.create(TwcommentPage, {
                "item": item, "accessToken" : this.accessToken
              });
              modal.present();
            }else if(item.type == 'route'){
              let modal = this.modalCtrl.create(TwcommentPage, {
                "item": item, "accessToken" : this.accessToken
              });
              modal.present();
            }else if(item.type == 'mp4'){
              let modal = this.modalCtrl.create(TwcommentPage, {
                "item": item, "accessToken" : this.accessToken
              });
              modal.present();

            }else if(item.type == 'youtube'){
              let modal = this.modalCtrl.create(TwcommentPage, {
                "item": item, "accessToken" : this.accessToken
              });
              modal.present();
            }else{
             // inAppBrowserRef = InAppBrowser.open('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com='+item.msg+'&userid='+this.loggedinuser+'&type=text',  '_blank', 'location=no');


              let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com='+item.msg+'&userid='+this.loggedinuser+'&type=text', '_blank');

            }

          }
        },
        {
          text: '',
          handler: () => {
            var inAppBrowserRef;
          //  inAppBrowserRef = InAppBrowser.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=',  '_blank', 'location=no');

            let browser = new InAppBrowser('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=', '_blank');
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
  changesharewithhtml(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Who should see this?',
      cssClass : 'sharewithactionsheet',
      buttons: [
        {
          text: 'Community',
          cssClass : (item.share_with==1)?'activebtn':'',
          handler: () => {
            this.changesharewithfun(item,1);
          }
        },{
          text: 'Friends',
          cssClass : (item.share_with==2)?'activebtn':'',
          handler: () => {
            this.changesharewithfun(item,2);
          }
        },{
          text: 'Friends of Friends',
          cssClass : (item.share_with==3)?'activebtn':'',
          handler: () => {
            this.changesharewithfun(item,3);
          }
        },{
          text: 'private me only',
          cssClass : (item.share_with==4)?'activebtn':'',
          handler: () => {
            this.changesharewithfun(item,4);
          }
        }
      ]
    });
    actionSheet.present();
  }

  changesharewithfun(item,valu){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var link = 'http://torqkd.com/user/ajs2/changeShareWith';
    var data = {status_id: item.id,valu:valu};


    this._http.post(link, data)
        .subscribe(data => {
          item.share_with = valu;
        }, error => {
          console.log("Oooops!");
        });
  }



  seemorepeople(){
    /*let modal = this.modalCtrl.create(SportspeoplePage, {
      "id": this.sportsid,
    });

    modal.present();*/
    this.navCtrl.push(SportspeoplePage, { "id": this.sportsid});
  }


  upArrow(){
    this.slider.slideNext(100);
  }

  downArrow(){
    if(this.slider.isBeginning()){
      this.slider.slideTo((this.spimagelistlength-1),100);
    }else{
      this.slider.slidePrev(100);
    }
  }

  playStatusVdo(videoval,poster){
    let modal = this.modalCtrl.create(HomevideomodalPage,{"url": "http://torqkd.com/uploads/video/converted/"+videoval,"poster":poster});
    modal.present();
  }

  /*****************************************************/
  checkOfflineData(){
    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("SELECT * FROM addroutesdata", {}).then((data) => {

        if(data.rows.length == 0){
          this.isOfflineData = 0;
        }else {
          this.isOfflineData = 1;



        }

      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }

  tableDelete2(tbl){

    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("DELETE FROM "+tbl, {}).then(() => {
        console.log(1);
      }, (err) => {
        console.log( JSON.stringify(err));
      });
    }, (err) => {
      console.log( JSON.stringify(err));
    });
  }

  /*****************************************************/

}
