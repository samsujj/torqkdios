import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,AlertController,MenuController} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import {SinglepostPage} from "../singlepost/singlepost";
import * as $ from "jquery";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {SQLite, Network} from "ionic-native";


/*
  Generated class for the NotificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/notification/notification.html',
})
export class NotificationPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private local:LocalStorage;
  private datalist3;

  private isInternet;
  public isOfflineData;

  public offset;
  public showviewmore;

  constructor(private navCtrl: NavController,private nav: Nav,private _http: Http,private sanitizer:DomSanitizationService,public menu: MenuController,public platform: Platform) {

    this.offset = 0;
    this.showviewmore = 1;

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
        this.getData();
      }
      else{
        this.loggedinuser = 0;
      }
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

  openmenu(){
    //$('.navmenul').click();
    this.menu.toggle();
  }

  getData(){

    var link = 'http://torqkd.com/user/ajs2/getNotificationListnew/id/'+this.loggedinuser+'/offset/'+this.offset;
    var data = {};

    this._http.post(link, data)
        .subscribe(res => {

          var resdata = res.json();

          if(this.offset > 0){
            this.datalist3=this.datalist3.concat(resdata);
          }else{
            this.datalist3 = resdata;
          }

          this.offset = this.offset + 10;

          /*if(resdata.length){
            this.getData();
          }*/

          if(resdata.length == 0){
            this.showviewmore = 0;
          }

        }, error => {
          console.log("Oooops!");
        });

  }

  getsanitizerstyle(imgsrc){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + imgsrc + ')');
  }
  getsanitizedcontent(content){
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  getsanibackcol(item){
    if(item.is_read1 == 0){
      return this.sanitizer.bypassSecurityTrustStyle('#d9d9d9 none repeat scroll 0 0');
    }else{
      return this.sanitizer.bypassSecurityTrustStyle('#ebebeb none repeat scroll 0 0');
    }
  }

  markasreadnot(item){
    this.nav.push(SinglepostPage,{postId: item.post_id });
    if(item.is_read1 == 0){
      var link = 'http://torqkd.com/user/ajs2/markasreadnot1';
      var data = {cid : this.loggedinuser, id: item.id};

      this._http.post(link, data)
          .subscribe(res => {

            item.is_read1 = res;

          }, error => {
            console.log("Oooops!");
          });
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
