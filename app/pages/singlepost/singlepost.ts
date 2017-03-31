import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, NavParams,ModalController, Platform,MenuController} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import * as $ from "jquery";
import { AlertController } from 'ionic-angular';
import { ActionSheetController ,ToastController } from 'ionic-angular';
import {Facebook, SQLite, Network} from 'ionic-native';
import {HomevideomodalPage} from "../homevideomodal/homevideomodal";
import {SocialcommentPage} from "../socialcomment/socialcomment";
import {tagpeoplelistPage} from "../tagpeoplelist/tagpeoplelist";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {FbcommentPage} from "../fbcomment/fbcomment";
import {NotificationPage} from "../notification/notification";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';

/*
  Generated class for the SinglepostPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/singlepost/singlepost.html',
})
export class SinglepostPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private local:LocalStorage;
  private postId;
  private statusdata;
  private accessToken;
  private notificationpage = NotificationPage;

  private isInternet;
  public isOfflineData;

  constructor(private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,private _navParams: NavParams,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,public menu: MenuController,public platform: Platform) {

    this.postId=this._navParams.get("postId");

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;
      this.singlePost();
    });

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

  singlePost(){
    var link = 'http://torqkd.com/user/ajs2/getsingleStatus';
    var data = {sess_user : this.loggedinuser,id:this.postId};



    this._http.post(link, data)
        .subscribe(res => {
          this.statusdata=(res.json().status);
          this.loadmaps(this.statusdata);
        }, error => {
          console.log("Oooops!");
        });
  }

  openmenu(){
    //$('.navmenul').click();
    this.menu.toggle();
  }

  launchVideo(url,poster) {
    let modal = this.modalCtrl.create(HomevideomodalPage, {
      "url": "http://torqkd.com/uploads/video/converted/"+url,
      "poster": poster
    });

    modal.present();
  }

  loadmaps(statusd){
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
          map[statusd[x].id] = new google.maps.Map(document.getElementById('map22'+statusd[x].id), myOptions);


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
  updatelike(itemid){
    console.log(itemid);

    var link1 = 'http://torqkd.com/user/ajs2/likestatus/id/'+itemid+'/userid/'+this.loggedinuser;
    //var data = $.param({email: event.email,password:event.password});
    //var data = JSON.stringify({email: event.email,password:event.password});
    var data1 = {userid :this.loggedinuser};



    this._http.post(link1,data1)
        .subscribe(data => {
          // /this.data1.response = data.json();
          //console.log(data);
          if(data.json()==null){
            //this.verifylogin=false;

            return;
          }
          else{


            console.log(data.json());
            console.log(this.statusdata);
            var x;
            for(x in this.statusdata){
              if(this.statusdata[x].id==itemid){
                this.statusdata[x].is_like=data.json().is_like;
                this.statusdata[x].like_no=data.json().like_no;
              }

            }

            //this.statusdata[itemid]['is_like']=datavalue.is_like;
            //this.statusdata[itemid]['is_like']=datavalue.is_like;


          }
        }, error => {
          console.log("Oooops!");
        });
  }

  toogleComment(item){
    let modal = this.modalCtrl.create(SocialcommentPage, {
      "item": item,
    });

    modal.present();
    //}

  }

  getyoutubecontent(videoid){
    var content = '<iframe width="99%" height="99%" src="https://www.youtube.com/embed/'+videoid+'" frameborder="0" allowfullscreen></iframe>';
    return this.sanitizer.bypassSecurityTrustHtml(content);
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
        }, error => {
          console.log("Oooops!");
        });
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
                  alert('image');
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
                          duration: 3000
                        });
                        toast.present();
                      }, error => {
                        let toast = this.toastCtrl.create({
                          message: 'An Error occured in FB Share',
                          duration: 3000
                        });
                        toast.present();
                      });
                }





              }else{
                alert('An Error occured in FB Login');
              }




              /*Facebook.api('/' + result.authResponse.userID + '?fields=id,name,gender,email,first_name,last_name',[]).then((result1) => {
               console.log(result1);
               alert(result1);
               var x;
               for (x in result1){
               alert(x+'---'+result1[x]);
               if(Array.isArray(result1[x])){
               let y;
               for (y in result1[x]) {
               alert(y + '' + result1[x][y]);
               }
               }
               }


               });*/



            });
          }
        },
        {
          text: ''
        },
        {
          text: ''
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
  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

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
