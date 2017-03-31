import { Component } from '@angular/core';
import {NavController, NavParams,ModalController} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {DomSanitizationService} from "@angular/platform-browser";
import {HomePage} from '../home/home';
import {UserblockListPage} from '../userblocklist/userblocklist';

@Component({
  templateUrl: 'build/pages/userblock/userblock.html',
})
export class UserblockPage {
  private local:LocalStorage;
  private loggedinuser;
  private serachkey = '';
  private blocklist;
  private noofblock;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public alertCtrl: AlertController,sanitizer:DomSanitizationService,public modalCtrl: ModalController) {
    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
        this.getblocklist();
      }else{
        this.navCtrl.push(HomePage);
      }
    }).catch((err)=>{
      this.navCtrl.push(HomePage);
    });



  }


  goback(){
    this.navCtrl.pop();
  }

  getblocklist(){
    /*******************Get block list [start]*************************/
    var link = 'http://torqkd.com/user/ajs2/getBlockpeople';
    var data = { cuser: this.loggedinuser };

    this._http.post(link, data)
        .subscribe(res => {
          this.blocklist = res.json();
          this.noofblock = this.blocklist.length;
        }, error => {
          console.log("Oooops!");
        });
    /*******************Get block list [end]*************************/
  }

  getsearchkey(keyval){
    this.serachkey = keyval;
  }

  searchus(){
    if(this.serachkey == ''){
      alert('Pease insert search key');
    }else {
      var link = 'http://torqkd.com/user/ajs2/searchUser';
      var data = { searchkey: this.serachkey, cuser: this.loggedinuser };

      this._http.post(link, data)
          .subscribe(res => {
            var items = res.json();
            if(items.length == 0){
              alert('No data found');
            }else{
              let modal = this.modalCtrl.create(UserblockListPage, {
                "items": items
              });

              modal.present();
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }

  unblockppl(item){
    var idx1 = this.blocklist.indexOf(item);
    var link = 'http://torqkd.com/user/ajs2/unblockpeople';
    var data = {cuser: this.loggedinuser,uid: item.id};


    this._http.post(link, data)
        .subscribe(data => {
          this.blocklist.splice(idx1,1);
          this.noofblock = this.noofblock -1;
        }, error => {
          console.log("Oooops!");
        });
  }

}
