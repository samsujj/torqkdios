import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage, LocalStorage,ModalController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {SignupactivityPage} from "../signupactivity/signupactivity";
import {SignupnextPage} from "../signupnext/signupnext";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {ControlGroup, Control} from "@angular/common";

/*
  Generated class for the SignupconnectPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/signupconnect/signupconnect.html',
})
export class SignupconnectPage {
  public homepage = HomePage;
  private filtereduserlist;
  private userlist;
  public sportlist = [];
  public sel_users = [];
  private local:LocalStorage;
  private userid;
  private showadvsearch = 0;
  public countrylist = [];
  public statelist = [];
  public stateLoad = false;
  public serachbyname = '';
  public serachbycountry = '';
  public serachbystate = '';

  constructor(private navCtrl: NavController,private _http: Http,public modalCtrl: ModalController) {

    this.local = new Storage(LocalStorage);

    this.local.get('newUserId').then((value) => {
      if(value!=null) {
        this.userid = value;
      }else{
        this.userid = 0;
      }
      this.userlistfu();
    }).catch((err)=>{
      this.userid = 0;
      this.userlistfu();
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


    /****************country list********************/
    var link3 = 'http://torqkd.com/user/ajs2/getCountryList';
    var data3 = {};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          this.countrylist = res3.json();
        }, error => {
          console.log("Oooops!");
        });
    /****************country List********************/

  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  userlistfu(){
    /****************User List********************/
    var link2 = 'http://torqkd.com/user/ajs2/userList1';
    var data2 = {id: this.userid};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.userlist = res2.json();
          this.filtereduserlist = this.userlist;
        }, error => {
          console.log("Oooops!");
        });
    /****************User List********************/
  }

  showadvsearchfun(){
    this.showadvsearch = (1-this.showadvsearch);
  }

  changecountry(countryval){
    this.serachbycountry = countryval;
    this.serachbystate = '';
    this.search();
    this.statelist = [];

    if(countryval != ''){
      this.stateLoad = true;
      var link3 = 'http://torqkd.com/user/ajs2/getStateList';
      var data3 = {id:countryval};



      this._http.post(link3, data3)
          .subscribe(res3 => {
            this.statelist = res3.json();
            this.stateLoad = false;
          }, error => {
            console.log("Oooops!");
            this.stateLoad = false;
          });
    }

  }
  
  search(){

    this.filtereduserlist = [];

    if(this.serachbycountry !='' && this.serachbystate !=''){
      if(this.serachbyname !=''){
        for(let n in this.userlist){
          if(this.userlist[n].user_country == this.serachbycountry && this.userlist[n].user_state == this.serachbystate && this.userlist[n].user_name.toLowerCase().indexOf(this.serachbyname.toLowerCase()) != -1){
            this.filtereduserlist.push(this.userlist[n]);
          }
        }
      }else {
        for(let n in this.userlist){
          if(this.userlist[n].user_country == this.serachbycountry && this.userlist[n].user_state == this.serachbystate){
            this.filtereduserlist.push(this.userlist[n]);
          }
        }
      }
    }else if(this.serachbycountry !=''){
      if(this.serachbyname !=''){
        for(let n in this.userlist){
          if(this.userlist[n].user_country == this.serachbycountry && this.userlist[n].user_name.toLowerCase().indexOf(this.serachbyname.toLowerCase()) != -1){
            this.filtereduserlist.push(this.userlist[n]);
          }
        }
      }else {
        for(let n in this.userlist){
          if(this.userlist[n].user_country == this.serachbycountry){
            this.filtereduserlist.push(this.userlist[n]);
          }
        }
      }
    }else {
      this.filtereduserlist = this.userlist;
    }



  }

  searchbyname(namekey){
    this.serachbyname = namekey;
    this.search();
  }

  changestate(stateval){
    this.serachbystate = stateval;
    this.search();
  }

  skip(){
    this.navCtrl.push(SignupnextPage);
  }

  selusercls(id){
    var idx = this.sel_users.indexOf(id);
    return ( idx > -1) ? 'active-pic connect-user-list' : 'connect-user-list';
  }

  selectUser(id){
    var idx = this.sel_users.indexOf(id);

    if(idx == -1){
      this.sel_users.push(id);
    }else{
      this.sel_users.splice(idx,1);
    }

  }

  next_c(){
    var link3 = 'http://torqkd.com/user/ajs2/addFreind';
    var data3 = {id : this.userid,selUsers :this.sel_users};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          this.navCtrl.push(SignupnextPage);

        }, error => {
          console.log("Oooops!");
        });
  }



}
