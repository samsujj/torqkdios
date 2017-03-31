import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage, LocalStorage,ModalController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {SignupconnectPage} from "../signupconnect/signupconnect";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {ControlGroup, Control} from "@angular/common";

/*
  Generated class for the SignupactivityPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/signupactivity/signupactivity.html',
})
export class SignupactivityPage {
  public homepage = HomePage;
  private sportlist;
  private sportsid;
  public sel_sports = [];
  private local:LocalStorage;
  private userid;

  constructor(private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http) {

    this.local = new Storage(LocalStorage);

    this.local.get('newUserId').then((value) => {
      if(value!=null) {
        this.userid = value;
      }else{
        this.userid = 0;
      }
    }).catch((err)=>{
      this.userid = 0;
    });

    /****************Sport List********************/
    var link3 = 'http://torqkd.com/user/ajs2/allsports';
    var data3 = {};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          this.sportlist = res3.json();

        }, error => {
          console.log("Oooops!");
        });
    /****************Sport List********************/

  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  selsports(id){
    var idx = this.sel_sports.indexOf(id);

    if(idx == -1){
      this.sel_sports.push(id);
    }else{
      this.sel_sports.splice(idx,1);
    }

  }

  zxczx(id){
    var idx = this.sel_sports.indexOf(id);
    return ( idx > -1) ? 'activeimg' : '';
  }

  next_a(){
    if(this.sel_sports.length == 0){
      alert('Please select sports');
    }else{
      var link3 = 'http://torqkd.com/user/ajs2/addSport';
      var data3 = {id : this.userid,selSports :this.sel_sports};



      this._http.post(link3, data3)
          .subscribe(res3 => {
            this.navCtrl.push(SignupconnectPage);

          }, error => {
            console.log("Oooops!");
          });
    }
  }

}
