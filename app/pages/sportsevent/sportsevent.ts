import { Component } from '@angular/core';
import { Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ToastController ,AlertController,ActionSheetController,Slides,MenuController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {Http, Headers} from "@angular/http";

import {SportsPage} from "../sports/sports";
import {SportsGroupPage} from "../sportsgroup/sportsgroup";
import {SportsStatPage} from "../sportsstat/sportsstat";
import {eventDetailsPage} from "../eventdetails1/eventdetails1";
import {SportspeoplePage} from "../sportspeople/sportspeople";
import {InAppBrowser, SQLite, Network} from "ionic-native";
import { ViewChild } from '@angular/core';

/*
  Generated class for the SportsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/sportsevent/sportsevent.html',
})
export class SportsEventPage {

    @ViewChild('mySlider') slider: Slides;

    mySlideOptions5 = {
        initialSlide: 0,
        loop: true,
        autoplay:6000
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
  public sportsgrouppage = SportsGroupPage;
  public sportsstatpage = SportsStatPage;

  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private sportsid;
  private spdescription;
  private isExpanded = 0;
  public banner1data;
  public banner2data;
  public eventdetailspage = eventDetailsPage;

  private eventoffset;
  private eventlist;
  private totalevent;
  private eventcount;

    private spimagelist;
    private spimagelistlength;

    private isInternet;
    public isOfflineData;

  constructor(private navCtrl: NavController,private _navParams: NavParams,public platform: Platform,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,public menu: MenuController) {
    this.sportsid=this._navParams.get("id");

    this.eventoffset = 0;

    this.getEventslist();


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
        });    /************************sports details[end]***********************/


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

    launch(url){
        let browser = new InAppBrowser(url, '_system');
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

  moredesp(){
    this.isExpanded = 1;
    this.spdescription = this.sportdet.sport_det.sport_desc;
  }
  lessdesp(){
    this.isExpanded = 0;
    var spdescrip = this.sportdet.sport_det.sport_desc;

    this.spdescription = spdescrip.substring(0, 200);
  }

  getEventslist(){
    var link = 'http://torqkd.com/user/ajs2/getSpEvents';
    var data = {offset: this.eventoffset,spId:this.sportsid};


    this._http.post(link, data)
        .subscribe(res => {
          var res2 = res.json();
          this.eventlist = res2.event;
          this.totalevent = res2.totalCount;
          this.eventcount = this.eventlist.length;
          this.eventoffset = parseInt(this.eventoffset)+5;
        }, error => {
          console.log("Oooops!");
        });

  }

  getMoreEvents(){
    var link = 'http://torqkd.com/user/ajs2/getSpEvents';
    var data = {offset: this.eventoffset,spId:this.sportsid};


    this._http.post(link, data)
        .subscribe(res => {
          var res2 = res.json();
          this.eventlist=this.eventlist.concat(res2.event);
          this.eventcount = this.eventlist.length;
          this.eventoffset = parseInt(this.eventoffset)+5;
        }, error => {
          console.log("Oooops!");
        });

  }

    seemorepeople(id){
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
