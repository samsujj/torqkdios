import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {PhotocommentsocialPage} from "../photocommentsocial/photocommentsocial";
import {Facebook} from 'ionic-native';
import {Fbcomment2Page} from "../fbcomment2/fbcomment2";
import {TwcommentPage} from "../twcomment/twcomment";
import { ActionSheetController,ToastController } from 'ionic-angular';
import { InAppBrowser} from "ionic-native";

/*
  Generated class for the PhotodetsocialPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/routedetails/routedetails.html',
})
export class RouteDetailsPage {
  private itemdet;
  private isMapload;

  constructor(public platform: Platform,private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController) {
    this.itemdet=this._navParams.get("item");
    this.isMapload = 1;

    console.log(this.itemdet);

    this.platform.ready().then((readySource) => {
      this.loadmap();
    });

  }

  goback(){
    this.navCtrl.pop();
  }

  loadmap(){

    if(this.isMapload == 1){

      this.isMapload = 0;

      let routes = this.itemdet;



      let bounds = new google.maps.LatLngBounds();
      let locations= routes.location;
      let markerp= routes.marker;


      let curP = new google.maps.LatLng(markerp[0].latitude, markerp[0].longitude);

      var myOptions = {
        zoom: 10,
        center: curP,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        scrollwheel:false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE]
        },
        disableDefaultUI: true
      }

      var elems = document.getElementsByClassName('map-canvas-det');
      var elemlength = elems.length;

      let map = new google.maps.Map(elems[elemlength-1], myOptions);

      let poly = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#F7931E',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });

      let path = new google.maps.MVCArray();

      let curLoc;

      if(locations.length>0){
        for(let n in locations){
          var stptggg = locations[n];
          var setcarr = new Array();

          curLoc = new google.maps.LatLng(stptggg.latitude, stptggg.longitude);

          bounds.extend(curLoc);

          path.push(curLoc);

          if(path.getLength() === 1) {
            poly.setPath(path);
            map.setCenter(curLoc);
            let marker = new google.maps.Marker({
              map: map,
              position: curLoc,
              icon:'http://torqkd.com/images/map-icon.png',
            });
          }
        }

        poly.setMap(map);

      }else{

        bounds.extend(curP);

        let marker = new google.maps.Marker({
          map: map,
          position: curP,
          icon:'http://torqkd.com/images/map-icon.png',
        });

      }

      map.fitBounds(bounds);
      map.setZoom( map.getZoom());
      google.maps.event.trigger(map, 'resize');

    }

  }

}
