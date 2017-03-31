import { Component,NgZone } from '@angular/core';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {
  Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform, NavParams, ActionSheetController,
  MenuController
} from "ionic-angular";
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {ViewroutesPage} from '../viewroutes/viewroutes';
import {Geolocation, Geoposition, SQLite, Network} from 'ionic-native';
import { BackgroundMode } from 'ionic-native';
import { BackgroundGeolocation } from 'ionic-native';
//import { LocationAccuracy } from 'ionic-native';
import { Insomnia } from 'ionic-native';

/*
  Generated class for the AddroutesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/addroutes2/addroutes2.html',
})
export class Addroutes2Page {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;

  public sportsId;
  public locationName;
  public address;
  public distance = 0;
  public distance_text;

  private local:LocalStorage;
  private loggedinuser;

  public latitude;
  public longitude;

  public map;
  public marker;
  public path = new google.maps.MVCArray();
  public poly;
  public bounds;
  public center;
  public myOptions = {};

  public latitude_loc;
  public longitude_loc;

  public isStart=false;
  public isStart1=false;


  public location;
  public location_arr = [];
  public location_arr2 = [];

  public sec=0;
  public min=0;
  public hour=0;

  public avg_sec=0;
  public avg_min=0;
  public avg_hour=0;

  public isMapLoad = false;

  public loclength;
  private watch:any;
  public isInternet;
  public offlinedata;
  public isOfflineData;

  public curlng;
  public curlat;

  public latlist;



  constructor(private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http,public actionSheetCtrl: ActionSheetController,public sanitizer:DomSanitizationService,public params: NavParams,public menuCtrl: MenuController,public platform: Platform,public zone: NgZone) {

    this.latlist = [];
  }

  ionViewDidEnter(){
    this.sportsId = this.params.get('sportsId');
    this.locationName = this.params.get('locationName');

    this.distance_text = this.distance.toFixed(3);


    Geolocation.getCurrentPosition().then((resp) => {

      BackgroundMode.enable();

      this.latitude=resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.loadmap();
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
      alert('Error getting location');
    });

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
      this.trackpath();

      if(Network.connection === 'none'){
        this.isInternet = 0;
      }else{
        this.isInternet = 1;
      }

      this.checkOfflineData();

      let disconnectSubscription = Network.onDisconnect().subscribe(() => {
        this.isInternet = 0;
        this.checkOfflineData();
      });

      let connectSubscription = Network.onConnect().subscribe(() => {
        this.isInternet = 1;

        this.checkOfflineData();

      });

    });
    /************************Check Internet [end]*******************************/
  }

  openmenu(){
    this.menuCtrl.open();
  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  formattimer(a){
    var aa;
    if (a < 10) {
      aa = '0' + a;
    }else{
      aa = a;
    }
    return aa;
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

  loadmap(){

    this.isMapLoad = true;



      this.bounds = new google.maps.LatLngBounds();

      this.center = new google.maps.LatLng(this.latitude , this.longitude);

      this.myOptions = {
        zoom: 10,
        center: this.center,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        scrollwheel:false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE]
        },
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(document.getElementById('map-canvas'), this.myOptions);

      this.poly = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#F7931E',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });

      this.poly.setMap(this.map);

      this.marker = new google.maps.Marker({
        map: this.map,
        position: this.center,
        icon:'http://torqkd.com/images/map-icon.png',
        //title:address[statusd[x].id]
      });

    this.location_arr.push(this.center);



      this.latitude_loc = this.latitude;
      this.longitude_loc = this.longitude;
    



  }

  trackpath(){

    alert(1);

    Insomnia.keepAwake()
        .then(
            () => {
              console.log('success');
            },
            () => {
              console.log('error');
            }
        );

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 500
    };

    BackgroundGeolocation.configure((location) => {
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.curlat = location.latitude;
        this.curlng = location.longitude;

        alert(2);
        //this.setPath();



      });

    }, (err) => {

      alert(4);
      console.log(err);

    }, config);

    // Turn ON the background-geolocation system.
    BackgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = Geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.curlat = position.coords.latitude;
        this.curlng = position.coords.longitude;

        alert(3);
        //this.setPath();





      });

    });
  }


  setPath(){

    alert(this.curlat);
    alert(this.curlng);

    this.latlist.push({lat:this.curlat, long:this.curlng})

    if(this.isStart){

      var curP = new google.maps.LatLng(this.curlat , this.curlng);

      if(this.location_arr.length == 0){
        this.marker = new google.maps.Marker({
          map: this.map,
          position: curP,
          icon:'http://torqkd.com/images/map-icon.png',
          //title:address[statusd[x].id]
        });
      }


      this.path.push(curP);

      this.poly.setPath(this.path);

      var bounds = this.createBoundsForMarkers(this.center, curP);

      this.poly.setMap(this.map);

      this.map.fitBounds(bounds);
      this.map.setZoom( this.map.getZoom());


      this.location_arr.push(curP);

      var loclength = this.location_arr.length;

      if(loclength > 1){

        var pos = this.location_arr[loclength-1];
        var Ppos = this.location_arr[loclength-2];

        var dis = google.maps.geometry.spherical.computeDistanceBetween(pos, Ppos);

        var diskm = (dis / 1000);
        var dismile = (diskm * 0.62137);


        this.distance = this.distance+dismile;
        this.distance_text = this.distance.toFixed(3);

        if(this.distance > 0){
          var sec:number;
          sec = this.sec;
          sec = sec + (this.min * 60);
          sec = sec + (this.hour * 60 * 60);

          var avg_pace:any = sec / this.distance;


          avg_pace = parseInt(avg_pace);

          if (isNaN(avg_pace))
            avg_pace = 0;
          var avg_hour:any = avg_pace / 3600;
          avg_hour = parseInt(avg_hour);
          if (isNaN(avg_hour))
            avg_hour = 0;
          avg_pace = avg_pace % 3600;
          avg_pace = parseInt(avg_pace);
          if (isNaN(avg_pace))
            avg_pace = 0;
          var avg_min:any = avg_pace / 60;
          avg_min = parseInt(avg_min);
          if (isNaN(avg_min))
            avg_min = 0;
          avg_pace = avg_pace % 60;
          if (isNaN(avg_pace))
            avg_pace = 0;
          var avg_sec:any = avg_pace;
          if (isNaN(avg_sec))
            avg_sec = 0;

          this.avg_hour =avg_hour;
          this.avg_min =avg_min;
          this.avg_sec =avg_sec;
        }


      }
    }

  }



  createBoundsForMarkers(center,Ppos) {
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(center);
    bounds.extend(Ppos);
    return bounds;
  }

  start(){

    if(!this.isStart1){
      this.isStart1 =true;
      this.location_arr = [];
      this.marker.setMap(null);
      //this.trackpath();

    }

    this.isStart =true;
   // this.getCurPosition();
    this.setTimer();

  }

  pause(){
    this.isStart =false;
  }

  setTimer(){
    if(this.isStart){
      if(this.min == 59 && this.sec == 59){
        this.hour += 1;
        this.min = 0;
        this.sec = 0;
      }else if(this.sec == 59){
        this.min += 1;
        this.sec =0;
      }else{
        this.sec += 1;
      }

      setTimeout(() => {

        this.setTimer();

      }, 1000);
    }
  }


  getCurPosition(){
    Geolocation.getCurrentPosition({ enableHighAccuracy: true}).then((resp) => {

      var curP = new google.maps.LatLng(resp.coords.latitude , resp.coords.longitude);

      if(this.location_arr.length == 0){
        this.marker = new google.maps.Marker({
          map: this.map,
          position: curP,
          icon:'http://torqkd.com/images/map-icon.png',
        });
      }

      this.path.push(curP);

      this.poly.setPath(this.path);

      var bounds = this.createBoundsForMarkers(this.center, curP);

      this.poly.setMap(this.map);

      this.map.fitBounds(bounds);
      this.map.setZoom( this.map.getZoom());


      this.location_arr.push(curP);

      var loclength = this.location_arr.length;

      this.loclength = loclength;

      if(loclength > 1){

        var pos = this.location_arr[loclength-1];
        var Ppos = this.location_arr[loclength-2];

        var dis = google.maps.geometry.spherical.computeDistanceBetween(pos, Ppos);

        var diskm = (dis / 1000);
        var dismile = (diskm * 0.62137);


        this.distance = this.distance+dismile;
        this.distance_text = this.distance.toFixed(3);

        if(this.distance > 0){
          var sec:number;
          sec = this.sec;
          sec = sec + (this.min * 60);
          sec = sec + (this.hour * 60 * 60);

          var avg_pace:any = sec / this.distance;


          avg_pace = parseInt(avg_pace);

          if (isNaN(avg_pace))
            avg_pace = 0;
          var avg_hour:any = avg_pace / 3600;
          avg_hour = parseInt(avg_hour);
          if (isNaN(avg_hour))
            avg_hour = 0;
          avg_pace = avg_pace % 3600;
          avg_pace = parseInt(avg_pace);
          if (isNaN(avg_pace))
            avg_pace = 0;
          var avg_min:any = avg_pace / 60;
          avg_min = parseInt(avg_min);
          if (isNaN(avg_min))
            avg_min = 0;
          avg_pace = avg_pace % 60;
          if (isNaN(avg_pace))
            avg_pace = 0;
          var avg_sec:any = avg_pace;
          if (isNaN(avg_sec))
            avg_sec = 0;

          this.avg_hour =avg_hour;
          this.avg_min =avg_min;
          this.avg_sec =avg_sec;
        }else{
          this.location_arr.splice(-1,1)
        }


      }


      setTimeout(() => {

        if(this.isStart){
          this.getCurPosition();
        }

      }, 10);


    }).catch((error) => {
      console.log('Error getting location', error);
      //alert('Error getting location');

      setTimeout(() => {

        if(this.isStart){
          this.getCurPosition();
        }

      }, 10);


    });
  }

  addRoutes(){

    this.isStart = false;
    this.isStart1 = false;


    var duration = this.formattimer(this.hour)+':'+this.formattimer(this.min)+':'+this.formattimer(this.sec);



    if(this.isInternet == 1){

      var link = 'http://torqkd.com/user/ajs2/addRoutes';
      var data = {userid: this.loggedinuser, location_arr: this.location_arr, route_name: this.locationName,duration:duration,distance:this.distance_text,sports_id:this.sportsId};

      this._http.post(link, data)
          .subscribe(res => {

            var sdfs:string = res.text();
            if(sdfs == '0'){
              alert('Error ocurred');
            }else{
              this.navCtrl.push(ViewroutesPage, {});
            }

          }, error => {
            console.log("Oooops!");
          });
    }else{
      this.offlinedata = {userid: this.loggedinuser, location_arr: this.location_arr, route_name: this.locationName,duration:duration,distance:this.distance_text,sports_id:this.sportsId};

      this.opendatase('addroutesdata');
      this.navCtrl.push(ViewroutesPage, {});

    }


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

  tableDelete2(tbl){

    let db = new SQLite();
    db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    }).then(() => {
      db.executeSql("DELETE FROM "+tbl, {}).then(() => {

      }, (err) => {
        console.log( JSON.stringify(err));
      });
    }, (err) => {
      console.log( JSON.stringify(err));
    });
  }

  tableinsert(tbl){

    let data;


    data = JSON.stringify(this.offlinedata);



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

        console.log(data.rows.length);


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

          if(this.isInternet == 1){
            let redata = data.rows.item(0).datacolum;

            var data99 =  JSON.parse(redata);

            var link = 'http://torqkd.com/user/ajs2/addRoutes';


            this._http.post(link, data99)
                .subscribe(res => {

                  this.tableDelete222('addroutesdata');

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

  tableDelete222(tbl){

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
