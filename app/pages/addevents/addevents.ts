import { Component } from '@angular/core';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ActionSheetController,MenuController,ToastController} from "ionic-angular";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {
  ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions, MediaCapture, ScreenOrientation,
  Transfer, Camera, StreamingMedia, StreamingVideoOptions, SQLite, Network
} from 'ionic-native';
import {HomePage} from '../home/home';
import {ProfilePage} from '../profile/profile';
import {UpdateprofilePage} from '../updateprofile/updateprofile';

/*
  Generated class for the AddeventsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/addevents/addevents.html',
})
export class AddeventsPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private addEventForm:FormGroup;
  private local:LocalStorage;
  private loggedinuser;
  private imagepath;
  private filepath;
  private imagename;
  private sportsid;
  private sportlist;
  private grouplist;
  private start_min;
  private start_max;
  private end_max;
  private end_min;
  private starttime;
  private endtime;
  private starttime_min;
  private starttime_max;
  private endtime_max;
  private endtime_min;
  private allday = 0;
  public countrylist = [];
  public statelist = [];
  public stateLoad = false;

  private isInternet;
  public isOfflineData;


  constructor(public fb: FormBuilder,private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http,public actionSheetCtrl: ActionSheetController,public menu: MenuController,public platform: Platform,private toastCtrl: ToastController) {

    var d = new Date();
    var n:number = d.getFullYear();

    this.starttime = "09:00";
    this.endtime = "09:00";

    this.start_min = n-1;
    this.start_max = n+10;
    this.end_min = n-1;
    this.end_max = n+10;





    this.imagename = '';
    this.sportsid = 0;

    this.addEventForm = fb.group({
      name: ["", Validators.required],
      description: [""],
      group_id: [0],
      from_date: ["", Validators.required],
      to_date: ["", Validators.required],
      location: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      zip: [""],
      country: ["", Validators.required],
      state: ["", Validators.required],
      register_url: [""],
      start_time: ["09:00", Validators.required],
      end_time: ["09:00", Validators.required],
      all_day: [false],
    });

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
      }else{
        this.navCtrl.push(HomePage);
      }
    }).catch((err)=>{
      this.navCtrl.push(HomePage);
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

    /****************group List********************/
    var link34 = 'http://torqkd.com/user/ajs2/getgroupList';
    var data34 = {};



    this._http.post(link34, data34)
        .subscribe(res34 => {
          this.grouplist = res34.json();
        }, error => {
          console.log("Oooops!");
        });
    /****************group List********************/

    /****************country list********************/
    var link35 = 'http://torqkd.com/user/ajs2/getCountryList';
    var data35 = {};



    this._http.post(link35, data35)
        .subscribe(res35 => {
          this.countrylist = res35.json();
        }, error => {
          console.log("Oooops!");
        });
    /****************country List********************/


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

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }
  selsports(id){
    this.sportsid = id;
  }
  zxczx(id){
    return ( id == this.sportsid) ? 'activeimg' : '';
  }

  handleChange(event){
    if(event._checked){
      this.allday = 1;
    }else{
      this.allday = 0;
    }
  }

  formsubmit(event){


    let x: any;

    for (x in this.addEventForm.controls) {
      this.addEventForm.controls[x].markAsTouched();
    }

    if(this.sportsid == 0){
      let toast = this.toastCtrl.create({
        message: 'Please select sport.',
        duration: 2000,
        position: 'middle',
        cssClass: 'addRoutesToast'
      });
      toast.present();
      return false;
    }

    if (this.addEventForm.valid) {

      var link = 'http://torqkd.com/user/ajs2/addevent';
      var data = {name:event.name,location:event.location,address:event.address,city:event.city,state:event.state,country:event.country,from_date:event.from_date,to_date:event.to_date,sports_id:this.sportsid,description:event.description,zip:event.zip,register_url:event.register_url,all_day:this.allday,start_time:event.start_time,end_time:event.end_time,user_id:this.loggedinuser,group_id:event.group_id};



      this._http.post(link, data)
          .subscribe(res => {

            var sdfs:string = res.text();
            if(sdfs == '0'){
              alert('Error ocurred');
            }else{
              this.navCtrl.push(ProfilePage, {});
            }

          }, error => {
            console.log("Oooops!");
          });


    }

  }

  changecountry(countryval){

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

  stdatesel(ev){
    var year = ev.year.value;
    var yeartxt = ev.year.text;
    var monthtxt = ev.month.text;
    var daytxt = ev.day.text;

    this.end_min = yeartxt+"-"+monthtxt+"-"+daytxt;
    this.end_max = year+5;
  }

  endatesel(ev){
    var year = ev.year.value;
    var yeartxt = ev.year.text;
    var monthtxt = ev.month.text;
    var daytxt = ev.day.text;

    this.start_max = yeartxt+"-"+monthtxt+"-"+daytxt;
    this.start_min = year-5;
  }

  sttimesel(ev){
    var hh:number = ev.hour.value;
    hh = hh+1;
    var mm:number = ev.minute.value;
    var mm2 = ((mm <10)?("0"+mm):mm);

    var cval = hh+":"+mm2;

    console.log(cval);

    (<FormControl>this.addEventForm.controls['end_time']).updateValue(cval);

  }

  entimesel(ev){
    console.log(ev);
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
