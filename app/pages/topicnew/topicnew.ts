import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,AlertController } from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import {ForumPage} from "../forum/forum";
import {ForumListPage} from "../forumlist/forumlist";
import {ForumDetailsPage} from "../forumdetails/forumdetails";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {SQLite, Network} from "ionic-native";

/*
  Generated class for the TopicnewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/topicnew/topicnew.html',
})
export class TopicnewPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private userdetails;
  private local:LocalStorage;
  private topicnewForm:FormGroup;
  private forumpage=ForumPage;
  private forumdetailspage = ForumDetailsPage;
  private forumid;

  private isInternet;
  public isOfflineData;

  constructor(fb: FormBuilder,private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,private _navParams: NavParams,public alertCtrl: AlertController,public platform: Platform) {
    this.forumid=this._navParams.get("id");

    this.topicnewForm = fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required]
    });

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser= JSON.parse(value).id;
        this.userdetails = JSON.parse(value);
      }
      else{
        this.loggedinuser= 0;
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

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  addNewTopic(fval){


    let x:any;
    console.log(this.topicnewForm.value.dob);

    for(x in this.topicnewForm.controls){
      this.topicnewForm.controls[x].markAsTouched();

    }

    if(this.topicnewForm.valid){
      var link = 'http://torqkd.com/user/ajs2/addnewTopic';
      var data = {description : fval.description,forumId : this.forumid, parentId : 0, sess_user : this.loggedinuser, title :fval.title};

      this._http.post(link, data)
          .subscribe(data1 => {

            this.navCtrl.push(ForumDetailsPage, {
              id: this.forumid
            });

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

          if(this.isInternet == 1){
            let redata = data.rows.item(0).datacolum;

            var data99 =  JSON.parse(redata);

            var link = 'http://torqkd.com/user/ajs2/addRoutes';


            this._http.post(link, data99)
                .subscribe(res => {

                  this.tableDelete2('addroutesdata');

                }, error => {
                  console.log("Oooops!");
                });
          }

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
