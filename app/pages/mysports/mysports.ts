import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,MenuController} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {SQLite, Network} from "ionic-native";

/*
  Generated class for the MysportsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/mysports/mysports.html',
})
export class MysportsPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private local:LocalStorage;
  private userImage;
  private itemlist;
  private userid;
  private userdetails;

  private isInternet;
  public isOfflineData;

  constructor(private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,private _navParams: NavParams,public menu: MenuController,public platform: Platform) {

    this.userid=this._navParams.get("userid");

    if(typeof (this.userid) != 'undefined'){
      this.getuserdetails();
      this.getsports();
    }else{
      this.local = new Storage(LocalStorage);

      this.local.get('userinfo').then((value) => {
        if(value!=null) {
          this.loggedinuser=JSON.parse(value).id;
          this.userid=JSON.parse(value).id;

          this.getuserdetails();
          this.getsports();

        }else{
          this.loggedinuser = 0;
        }
      }).catch((err)=>{
        this.loggedinuser = 0;
      });
    }


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

  getuserdetails(){
    var link1 = 'http://torqkd.com/user/ajs2/getuserdetailsnew';
    var data1 = {userid: this.userid};

    this._http.post(link1, data1)
        .subscribe(data => {
          if(data.json()==null){
            return;
          }else{
            this.userdetails=data.json();
          }
        }, error => {
          console.log("Oooops!");
        });
  }

  getsports(){
    var link = 'http://torqkd.com/user/ajs2/usersportsnew';
    var data = {userid : this.userid };



    this._http.post(link, data)
        .subscribe(res => {
          this.itemlist = res.json();

        }, error => {
          console.log("Oooops!");
        });
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
