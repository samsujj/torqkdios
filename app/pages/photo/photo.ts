import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,MenuController} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import {PhotodetPage} from "../photodet/photodet";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {SQLite, Network} from "ionic-native";

/*
  Generated class for the PhotoPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/photo/photo.html',
})
export class PhotoPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private local:LocalStorage;
  private photolist;

  private isInternet;
  public isOfflineData;

  public offset;
  public showviewmore;


  constructor(private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,public menu: MenuController,public platform: Platform) {

    this.offset = 0;
    this.showviewmore = 1;



    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;
      console.log(JSON.parse(value).id);
      if(value!=null) {
        this.getAllImages();
      }
      else{
        $('ion-content').removeClass('hide');
        this.loggedinuser = 0;
        this.getAllImages();
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
  getAllImages(){
    var link = 'http://torqkd.com/user/ajs2/getAllImagenew';
    var data = {sessUser : this.loggedinuser,offset:this.offset};



    this._http.post(link, data)
        .subscribe(res => {

          var resdata = res.json();

          if(this.offset > 0){
            this.photolist=this.photolist.concat(resdata);
          }else{
            this.photolist = resdata;
          }

          this.offset = this.offset + 10;



          if(resdata.length == 0){
            this.showviewmore = 0;
          }


        }, error => {
          console.log("Oooops!");
        });

  }

  getsanitizerstyle(imgsrc){
    return this.sanitizer.bypassSecurityTrustStyle('url(http://torqkd.com/user/ajs1/createimage?image=' + imgsrc + ')');
  }

  showPhotoDetails(item){
    /*let modal = this.modalCtrl.create(PhotodetPage, {
      "item": item,
    });

    modal.present();*/
    this.navCtrl.push(PhotodetPage, { "item": item });
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
