import { Component } from '@angular/core';
import {Storage, LocalStorage,NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import {ProfilePage} from "../profile/profile";
import {FriendsPage} from "../friends/friends";
import {CommunityPage} from "../community/community";
import {FriendsProfilePage} from "../friendsprofile/friendsprofile";

/*
  Generated class for the UserpopupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/userpopup/userpopup.html',
})
export class UserpopupPage {
    private loggedinuser;
  private item;
  private ptype;
  public profilepage = ProfilePage;
  public friendsprofilepage = FriendsProfilePage;
    private local:LocalStorage;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http) {
    this.item=this._navParams.get("item");
    this.ptype=this._navParams.get("redirectpage");


      this.local = new Storage(LocalStorage);

      this.local.get('userinfo').then((value) => {
          this.loggedinuser=JSON.parse(value).id;
      });
  }

  goback(){
    this.navCtrl.pop();
  }

    cancelreq(){
        var link = 'http://torqkd.com/user/ajs2/cancelreq';
        var data = {id:this.item.frnd_rel_id};



        this._http.post(link, data)
            .subscribe(res => {
                if(this.ptype == 'friends'){
                    this.navCtrl.push(FriendsPage, { });
                }else{
                    this.navCtrl.push(CommunityPage, { });
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    acceptreq(){
        var link = 'http://torqkd.com/user/ajs2/acceptreq';
        var data = {id:this.item.frnd_rel_id};



        this._http.post(link, data)
            .subscribe(res => {
                if(this.ptype == 'friends'){
                    this.navCtrl.push(FriendsPage, { });
                }else{
                    this.navCtrl.push(CommunityPage, { });
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    frndconnect(){
        var link = 'http://torqkd.com/user/ajs2/addconn';
        var data = {userid:this.loggedinuser,frnd_id:this.item.id};



        this._http.post(link, data)
            .subscribe(res => {
                if(this.ptype == 'friends'){
                    this.navCtrl.push(FriendsPage, { });
                }else{
                    this.navCtrl.push(CommunityPage, { });
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    goprofile(item){
        this.navCtrl.push(FriendsProfilePage, { userid:item.id});
    }


}
