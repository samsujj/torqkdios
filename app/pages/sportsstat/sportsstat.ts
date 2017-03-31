import { Component } from '@angular/core';
import { Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ToastController ,AlertController,ActionSheetController,Slides,MenuController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {Http, Headers} from "@angular/http";

import {SportsPage} from "../sports/sports";
import {SportsEventPage} from "../sportsevent/sportsevent";
import {SportsGroupPage} from "../sportsgroup/sportsgroup";
import {statDetPage} from "../statdet/statdet";
import '../../../node_modules/chart.js/src/chart.js';
import { BaseChartComponent } from 'ng2-charts/ng2-charts';
import {SportspeoplePage} from "../sportspeople/sportspeople";
import {InAppBrowser, SQLite, Network} from "ionic-native";
import { ViewChild } from '@angular/core';

/*
  Generated class for the SportsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/sportsstat/sportsstat.html',
  directives: [BaseChartComponent]
})
export class SportsStatPage {

  @ViewChild('mySlider') slider: Slides;

  mySlideOptions5 = {
    initialSlide: 0,
    loop: true,
    autoplay:6000
  };
  mySlideOptions1 = {
    initialSlide: 0,
    loop: true,
    autoplay:4000
  };

  mySlideOptions2 = {
  initialSlide: 0,
  loop: true,
  autoplay:4000
};

  mySlideOptions3 = {
    initialSlide: 0,
    loop: true,
    autoplay:4000
  };

  private sportdet;


  public sportspage = SportsPage;
  public sportseventpage = SportsEventPage;
  public sportsgrouppage = SportsGroupPage;

  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private sportsid;
  private spdescription;
  private isExpanded = 0;
  public banner1data;
  public banner2data;

  private statdata2;
  private statcount;


  private spimagelist;
  private spimagelistlength;


  /*******************************Chat Settings [start] ******************************************/

  public lineChartOptions:any = {
    animation: false,
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel : {
          display:true,
          labelString : 'Activity',
          fontColor : '#555555',
          fontFamily : '"veneerregular"',
          fontSize : 12
        },
        gridLines : {
          color :'#ddd',
          lineWidth : 1,
          tickMarkLength :0
        },
        ticks : {
          fontColor : '#555555',
          fontFamily : '"veneerregular"',
        }
      }],
      xAxes : [{
        gridLines : {
          display : false,
        },
        ticks : {
          fontColor : '#555555',
          fontFamily : '"veneerregular"',
        }
      }]
    },
    title: {
      display: true,
      text: 'Last 6 Months',
      fontFamily : '"veneerregular"',
      fontSize : 18,
      fontColor : '#555555'
    },
    legend : {
      position : 'bottom',
      labels : {
        fontFamily : '"veneerregular"',
        fontColor : '#555555',
        boxWidth : 0
      }
    }
  };
  public lineChartColors:Array<any> = [
    { // grey
      borderColor: 'rgba(247,146,19,1)',
      pointBackgroundColor: 'rgba(247,146,19,1)',
      pointBorderColor: 'rgb(247,146,19)',
      pointHoverBackgroundColor: 'rgb(247,146,19)',
      pointHoverBorderColor: 'rgba(247,146,19,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  /*******************************Chat Settings [end] ******************************************/

  private isInternet;
  public isOfflineData;

  constructor(private navCtrl: NavController,private _navParams: NavParams,public platform: Platform,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,public menu: MenuController) {
    this.sportsid=this._navParams.get("id");


    /************************sports details[start]***********************/
    var link2 = 'http://torqkd.com/user/ajs2/sportDet';
    var data2 = {id: this.sportsid};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.sportdet=res2.json();
          var spdescrip = this.sportdet.sport_det.sport_desc;

          this.spdescription = spdescrip.substring(0, 200);
        }, error => {
          console.log("Oooops!");
        });    /************************sports details[end]***********************/


    /***************banner slider [start]********************/
    var link21 = 'http://torqkd.com/user/ajs2/getProfilebanners';
    var data21 = {pageid: 2,sp_id:this.sportsid};



    this._http.post(link21, data21)
        .subscribe(res21 => {
          this.banner1data=res21.json().banner1;
          this.banner2data=res21.json().banner2;
        }, error => {
          console.log("Oooops!");
        });
    /***************banner slider [end]********************/


    /*****************Get User Stat[start]**********************/
    var link5 = 'http://torqkd.com/user/ajs2/getSpStat';
    var data5 = {spId : this.sportsid};

    this._http.post(link5, data5)
        .subscribe(res => {
          if(res.json()==null){

            return;
          }
          else{
            var res2 = res.json();
            this.statdata2 = res2;
            this.statcount = res2.length;
          }
        }, error => {
          console.log("Oooops!");
        });
    /*****************Get User Stat[start]**********************/

    /***************sp image [start]********************/
    var link211 = 'http://torqkd.com/user/ajs2/spImagelist';
    var data211 = {id:this.sportsid};



    this._http.post(link211, data211)
        .subscribe(res211 => {
          this.spimagelist=res211.json();
          this.spimagelistlength = this.spimagelist.length;
        }, error => {
          console.log("Oooops!");
        });
    /***************sp image [end]********************/

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

  launch(url){
    let browser = new InAppBrowser(url, '_system');
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

  moredesp(){
    this.isExpanded = 1;
    this.spdescription = this.sportdet.sport_det.sport_desc;
  }
  lessdesp(){
    this.isExpanded = 0;
    var spdescrip = this.sportdet.sport_det.sport_desc;

    this.spdescription = spdescrip.substring(0, 200);
  }

  /******************Stat Chart[start]**********************/
  getLineChartData(item){

    var rdata = [
      {
        data: item.data,
        label: 'Month',
        fill:false,
        lineTension : 0,
        pointRadius : 5
      }
    ];

    return rdata;
  }
  getLineChartLabels(item){
    var rdata = item.mon;
    return rdata;
  }
  /******************Stat Chart[end]**********************/


  viewstatdet(item){
    let modal = this.modalCtrl.create(statDetPage, {
      "item": item.statDet,
    });

    modal.present();
  }
  seemorepeople(){
    /*let modal = this.modalCtrl.create(SportspeoplePage, {
     "id": this.sportsid,
     });

     modal.present();*/
    this.navCtrl.push(SportspeoplePage, { "id": this.sportsid});
  }

  upArrow(){
    this.slider.slideNext(100);
  }

  downArrow(){
    if(this.slider.isBeginning()){
      this.slider.slideTo((this.spimagelistlength-1),100);
    }else{
      this.slider.slidePrev(100);
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
