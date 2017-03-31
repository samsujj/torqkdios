import { Component } from '@angular/core';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ActionSheetController,MenuController, ToastController} from "ionic-angular";
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {Addroutes2Page} from '../addroutes2/addroutes2';
import {SQLite, Network} from "ionic-native";

/*
  Generated class for the AddroutesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/addroutes/addroutes.html',
})
export class AddroutesPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;

  public issportshow = false;
  public islocationshow = false;
  public sportsId;
  public sportsName;
  public locationName;

  private local:LocalStorage;
  private loggedinuser;
  private isInternet;

  private splist;
  public isOfflineData;


  constructor(private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http,public actionSheetCtrl: ActionSheetController,public sanitizer:DomSanitizationService,public menu: MenuController,private toastCtrl: ToastController,public platform: Platform) {

      this.sportsId = 0;
      this.locationName = '';

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
      }
      else{
        this.loggedinuser = 0;
      }
    }).catch((err)=>{
      this.loggedinuser = 0;
    });



    /************************Check Internet [start]*****************************/
    this.platform.ready().then(() => {

      if(Network.connection === 'none'){
        this.isInternet = 0;
      }else{
        this.isInternet = 1;
      }
      this.isOfflineData = 0;
      this.getSportList();

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

  getSportList(){


    this.getFromdb('addroutsSpList');

    if(this.isInternet == 1){
      var link3 = 'http://torqkd.com/user/ajs2/allsports';
      var data3 = {};



      this._http.post(link3, data3)
          .subscribe(res3 => {
            this.splist = res3.json();
            this.opendatase('addroutsSpList');
          }, error => {
            console.log("Oooops!");
          });
    }


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

  addhideclass(hparam){
    if(typeof (hparam) == 'undefined'){
      return 'hide';
    }else{
      if(!hparam){
        return 'hide';
      }
    }

    return '';
  }

  getsanitcontent(content){
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  selsports(item){
    this.sportsId = item.id;
    this.sportsName = item.name;

    this.issportshow = !this.issportshow;
    this.islocationshow = !this.islocationshow

  }

    changelocname(keyval){
        this.locationName = keyval;
    }

  gotostep2(){
    if(this.sportsId == 0){
      let toast = this.toastCtrl.create({
        message: 'Please select sport.',
        duration: 2000,
        position: 'middle',
        cssClass: 'addRoutesToast'
      });
      toast.present();
      return false;
    }
    if(this.locationName == ''){
      let toast = this.toastCtrl.create({
        message: 'Please enter location name.',
        duration: 2000,
        position: 'middle',
        cssClass: 'addRoutesToast'
      });
      toast.present();
      return false;
    }

   // this.navCtrl.push(Addroutes2Page, {sportsId: this.sportsId ,locationName : this.locationName });
    this.navCtrl.setRoot(Addroutes2Page, {sportsId: this.sportsId ,locationName : this.locationName });

  }

  /*****************************For SQL Data[start]*******************************************/


  opendatase(tbl){
    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql('CREATE TABLE IF NOT EXISTS '+tbl+'(datacolum VARCHAR(32))', {}).then(() => {

        this.checkTable(tbl);

      }, (err) => {
        console.log(JSON.stringify(err));
      });
    }, (err) => {
      console.log(JSON.stringify(err));
    });
  }

  checkTable(tbl){
    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("SELECT * FROM "+tbl, {}).then((data) => {

        if(data.rows.length == 0){
          this.tableinsert(tbl);
        }else {
          this.tableDelete(tbl);
        }

      }, (err) => {
        console.log( JSON.stringify(err));
      });
    }, (err) => {
      console.log( JSON.stringify(err));
    });
  }

  tableDelete(tbl){

    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("DELETE FROM "+tbl, {}).then(() => {

        this.tableinsert(tbl);

      }, (err) => {
        console.log( JSON.stringify(err));
      });
    }, (err) => {
      console.log( JSON.stringify(err));
    });
  }

  tableinsert(tbl){

    let data;


    data = JSON.stringify(this.splist);



    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("INSERT INTO "+tbl+" (datacolum) VALUES ('"+data+"')", {}).then(() => {
        console.log('insert table successfully');
      }, (err) => {
        console.log( JSON.stringify(err));
      });
    }, (err) => {
      console.log( JSON.stringify(err));
    });
  }

  getFromdb(tbl){
    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("SELECT * FROM "+tbl, {}).then((data) => {

        if(data.rows.length){
          let redata = data.rows.item(0).datacolum;

          this.splist = JSON.parse(redata);
        }


      }, (err) => {
        console.log( JSON.stringify(err));
      });
    }, (err) => {
      console.log( JSON.stringify(err));
    });
  }

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

  /*****************************For SQL Data[end]*******************************************/


}
