import {Component, ViewChild} from "@angular/core";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Splashscreen, InAppBrowser, ImagePicker, SQLite, Network} from "ionic-native";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,MenuController} from "ionic-angular";
import * as $ from "jquery";
import {DomSanitizationService} from "@angular/platform-browser";
import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {GroupdetailsPage} from "../groupdetails/groupdetails";
import {GroupmembersPage} from "../groupmembers/groupmembers";
import {GroupsettingsPage} from "../groupsettings/groupsettings";
import {statDetPage} from "../statdet/statdet";
import '../../../node_modules/chart.js/src/chart.js';
import { BaseChartComponent } from 'ng2-charts/ng2-charts';
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';


/*
  Generated class for the GroupstatPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/groupstat/groupstat.html',
  directives: [BaseChartComponent]
})
export class GroupstatPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;

  private groupdetailspage = GroupdetailsPage;
  private groupmemberspage = GroupmembersPage;
  private groupsettingspage = GroupsettingsPage;

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

  private groupid;
  public banner1data;
  public banner2data;
  private local:LocalStorage;
  private groupdet;
  private loggedinuser;
  private isMember;
  private isAdmin;
  private statdata2;
  private statcount;

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


  constructor(fb: FormBuilder,public platform: Platform,navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public params: NavParams,public menu: MenuController) {
    this.groupid = this.params.get('id');

    console.log(this.groupid);

    this.isMember = 0;
    this.isAdmin = 0;

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;

      this.getGroupdet()
      if(value!=null) {
        console.log(1);
      }
      else{
        $('ion-content').removeClass('hide');
      }
    }).catch((err)=>{
      this.loggedinuser = 0;
      this.getGroupdet();
    });

    /***************banner slider [start]********************/
    var link2 = 'http://torqkd.com/user/ajs2/getProfilebanners';
    var data2 = {pageid: 4,sp_id:0};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.banner1data=res2.json().banner1;
          this.banner2data=res2.json().banner2;
        }, error => {
          console.log("Oooops!");
        });
    /***************banner slider [end]********************/

    /*****************Get User Stat[start]**********************/
    var link5 = 'http://torqkd.com/user/ajs2/getGroupStat';
    var data5 = {groupId:this.groupid};

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
  launch(url){

    let browser = new InAppBrowser(url, '_system');
  }
  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  getGroupdet(){
    var link2 = 'http://torqkd.com/user/ajs2/getGroupDet';
    var data2 = {id: this.groupid, sess_user:this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.groupdet=res2.json();

          if(this.groupdet.is_member > 0){
            this.isMember = 1;
            if(this.groupdet.is_member == 2)
              this.isAdmin = 1;
          }

        }, error => {
          console.log("Oooops!");
        });
  }

  joingroup(){
    var link2 = 'http://torqkd.com/user/ajs2/joingroup';
    var data2 = {groupid: this.groupid, userid:this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.isMember = 1;
        }, error => {
          console.log("Oooops!");
        });
  }

  leavegroup(){
    var link2 = 'http://torqkd.com/user/ajs2/leavegroup';
    var data2 = {groupid: this.groupid, userid:this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.isMember = 0;
          this.isAdmin = 0;
        }, error => {
          console.log("Oooops!");
        });
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
    console.log(item.statDet);
    let modal = this.modalCtrl.create(statDetPage, {
      "item": item.statDet,
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
