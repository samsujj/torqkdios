import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,AlertController, MenuController } from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import {ForumPage} from "../forum/forum";
import {ForumListPage} from "../forumlist/forumlist";
import {TopicdetailsPage} from "../topicdetails/topicdetails";
import {TopicnewPage} from "../topicnew/topicnew";
import {TopicmovePage} from "../topicmove/topicmove";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {SQLite, Network} from "ionic-native";

/*
  Generated class for the ForumPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/forumdetails/forumdetails.html',
})
export class ForumDetailsPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private userdetails;
  private local:LocalStorage;
  private isLoad;
  private forumdet;
  private forumid;
  private forumpage=ForumPage;
  private forumlistpage = ForumListPage;
  private topicdetailspage = TopicdetailsPage;
  private topicnewpage = TopicnewPage;

  private isInternet;
  public isOfflineData;


  constructor(private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,private _navParams: NavParams,public alertCtrl: AlertController,public menu: MenuController,public platform: Platform) {
    this.forumid=this._navParams.get("id");
    this.local = new Storage(LocalStorage);

    this.isLoad = false;

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser= JSON.parse(value).id;
        this.userdetails = JSON.parse(value);
      }
      else{
        this.loggedinuser= 0;
      }
      this.getForumList();
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

  getForumList(){
    var link = 'http://torqkd.com/user/ajs2/getForumTopicList';
    var data = { id : this.forumid };



    this._http.post(link, data)
        .subscribe(res => {
          this.forumdet = res.json();
          this.isLoad = true;
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


  deletetopic(item){

    let confirm = this.alertCtrl.create({
      title: '',
      message: 'Are you sure delete this topic?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deletetopicconfirm1(item);
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

  deletetopicconfirm1(item){
    var idx1 = this.forumdet.topicList.indexOf(item);

    var link = 'http://torqkd.com/user/ajs2/delTopic';
    var data = {id: item.id};


    this._http.post(link, data)
        .subscribe(data => {
          this.forumdet.topicList.splice(idx1,1);
        }, error => {
          console.log("Oooops!");
        });
  }

  movetopic(item){
    let modal = this.modalCtrl.create(TopicmovePage, {
      "topicid": item.id,
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
