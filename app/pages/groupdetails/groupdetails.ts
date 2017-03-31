import {Component, ViewChild} from "@angular/core";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ImagePicker, SQLite, Network} from "ionic-native";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ToastController,MenuController} from "ionic-angular";
import {Splashscreen, InAppBrowser,YoutubeVideoPlayer,StreamingMedia, StreamingVideoOptions,Facebook} from "ionic-native";
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {GroupmembersPage} from "../groupmembers/groupmembers";
import {GroupsettingsPage} from "../groupsettings/groupsettings";
import {GroupstatPage} from "../groupstat/groupstat";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {PhotodetsocialPage} from "../photodetsocial/photodetsocial";
import {Homevideomodal1Page} from "../homevideomodal1/homevideomodal1";
import {SocialcommentPage} from "../socialcomment/socialcomment";
import {FbcommentPage} from "../fbcomment/fbcomment";
import {TwcommentPage} from "../twcomment/twcomment";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {RouteDetailsPage} from '../routedetails/routedetails';
import {HomevideomodalPage} from '../homevideomodal/homevideomodal'

/*
  Generated class for the GroupdetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/groupdetails/groupdetails.html',
})
export class GroupdetailsPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private groupstatpage = GroupstatPage;
  private groupmemberspage = GroupmembersPage;
  private groupsettingspage = GroupsettingsPage;

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

  private groupid;
  public banner1data;
  public banner2data;
  private local:LocalStorage;
  private groupdet;
  private loggedinuser;
  private isMember;
  private isAdmin;
  private socialfeedoffset;
  private statusdata;
  private accessToken;
  private isInternet;
  public isOfflineData;

  constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public params: NavParams,public toastCtrl: ToastController,public menu: MenuController) {
    this.groupid = this.params.get('id');

    console.log(this.groupid);

  this.isMember = 0;
  this.isAdmin = 0;

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;

      this.getGroupdet();
      this.getstatus();
      if(value!=null) {
        console.log(1);
      }
      else{
        $('ion-content').removeClass('hide');
      }
    }).catch((err)=>{
      this.loggedinuser = 0;
      this.getGroupdet();
      this.getstatus();
    });

    /***************banner slider [start]********************/
    var link2 = 'http://torqkd.com/user/ajs2/getProfilebanners';
    var data2 = {pageid: 4,sp_id:0};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.banner1data=res2.json().banner1;
          this.banner2data=res2.json().banner2;
        }, error => {
          console.log("Oooops!");
        });
    /***************banner slider [end]********************/

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

  openmenu(){
    //$('.navmenul').click();
    this.menu.toggle();
  }
  launch(url){

//    InAppBrowser.open(url,  '_system', 'location=yes');

    let browser = new InAppBrowser(url, '_system');
  }
  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  getGroupdet(){
    var link2 = 'http://torqkd.com/user/ajs2/getGroupDet';
    var data2 = {id: this.groupid, sess_user:this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.groupdet=res2.json();

          if(this.groupdet.is_member > 0){
            this.isMember = 1;
            if(this.groupdet.is_member == 2)
              this.isAdmin = 1;
          }

        }, error => {
          console.log("Oooops!");
        });
  }

  joingroup(){
    var link2 = 'http://torqkd.com/user/ajs2/joingroup';
    var data2 = {groupid: this.groupid, userid:this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.isMember = 1;
        }, error => {
          console.log("Oooops!");
        });
  }

  leavegroup(){
    var link2 = 'http://torqkd.com/user/ajs2/leavegroup';
    var data2 = {groupid: this.groupid, userid:this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.isMember = 0;
          this.isAdmin = 0;
        }, error => {
          console.log("Oooops!");
        });
  }


  getstatus(){
    var link1 = 'http://torqkd.com/user/ajs2/getgroupStatus';
    var data1 = {sess_user :this.loggedinuser ,groupId: this.groupid,offset:this.socialfeedoffset};



    this._http.post(link1, data1)
        .subscribe(data => {

          if(this.socialfeedoffset>0)
            this.statusdata=this.statusdata.concat(data.json().status);
          else this.statusdata=(data.json().status);

          this.loadmaps1(this.statusdata);
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

          var elems = document.getElementsByClassName('map-canvas-group'+statusd[x].id);
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

                    toast.onDidDismiss(() => {
                      this.navCtrl.pop();
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
           // inAppBrowserRef = InAppBrowser.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=',  '_blank', 'location=no');
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
