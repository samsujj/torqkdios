import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform, AlertController,MenuController, ViewController} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import * as $ from "jquery";
import {DailypollresultPage} from "../dailypollresult/dailypollresult";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {SQLite, Network} from "ionic-native";
import '../../../node_modules/chart.js/src/chart.js';
import { BaseChartComponent } from 'ng2-charts/ng2-charts';
import {ProfilePage} from '../profile/profile'

/*
  Generated class for the DailypolPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/dailypoll/dailypoll.html',
    directives: [BaseChartComponent]
})
export class DailypollPage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private local:LocalStorage;
  private itemlist;
  private totalitem;
  private currentindex;
  private currentitem;
  private selAnswer;

    private isInternet;
    public isOfflineData;

    public itemdet;
    public newLabels;
    public isLoad;

    public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    public pieChartData:number[] = [300, 500, 100];
    public pieChartType:string = 'pie';
    public pieChartOption:any = {
        animation: false,
        responsive: true,

        title: {
            display: false
        },
        legend : {
            display: false
        }
    };
    public pieChartColors:Array<any> = [
        { // grey
            backgroundColor: ['#F7931E','#58595B','#9A9C9B','#231F20','#EBEBEB','#FAC88D']
        }
    ];


    constructor(private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,private alertCtrl: AlertController,public menu: MenuController,public platform: Platform,public viewCtrl: ViewController) {
    this.currentindex = 0;

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {


      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
        this.getPolls();
      }
      else{
        this.loggedinuser = 0;
        $('ion-content').removeClass('hide');
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
    openmenu(){
        //$('.navmenul').click();
        this.menu.toggle();
    }

  getPolls(){
    var link = 'http://torqkd.com/user/ajs2/getpolldetnew';
    var data = { user_id : this.loggedinuser};

    this._http.post(link, data)
        .subscribe(res => {
          this.itemlist = res.json();
          this.totalitem = this.itemlist.length;
          console.log(this.totalitem);
          if(this.totalitem > 0){
            this.currentitem = this.itemlist[this.currentindex];
          }

            if(this.currentitem.sel_ans > 0){
                this.showpollres();
            }

        }, error => {
          console.log("Oooops!");
        });
  }

  votepoll(){

      if(typeof (this.selAnswer) != 'undefined' && this.selAnswer > 0){
          if(this.selAnswer != this.currentitem.sel_ans){
              var link = 'http://torqkd.com/user/ajs2/savevotenew';
              var data = { poll_id : this.currentitem.ques_id, ans_id : this.selAnswer, user_id : this.loggedinuser };

              this._http.post(link, data)
                  .subscribe(res => {
                      this.currentitem.sel_ans = this.selAnswer;
                      this.selAnswer = 0;
                      this.nextpoll();
                  }, error => {
                      console.log("Oooops!");
                  });
          }else {
              this.nextpoll();
          }
      }else{
          if(this.currentitem.sel_ans !=0){
              this.nextpoll();
          }else{
              let alert = this.alertCtrl.create({
                  title: 'Select Answer',
                  subTitle: 'First select your answer then click VOTE button.',
                  cssClass : 'vote-alert-class',
                  buttons: ['OK']
              });
              alert.present();
          }
      }


  }

    getsanitizerstyle(imgsrc){
        var content = 'http://torqkd.com/uploads/pollback/thumb/'+imgsrc;
        return this.sanitizer.bypassSecurityTrustStyle('url(' + content + ')');
    }

    changeRadio(ev){
        this.selAnswer = ev;
    }

    nextpoll(){
        if(this.currentindex == (parseInt(this.totalitem)-1)){
            this.currentindex = 0;
        }else{
            this.currentindex = parseInt(this.currentindex)+1;
        }

        this.currentitem = this.itemlist[this.currentindex];

        if(this.currentitem.sel_ans > 0){
            this.showpollres();
        }
    }

    backpoll(){
        /*if(this.currentindex > 0){
            this.currentindex = parseInt(this.currentindex)-1;

            this.currentitem = this.itemlist[this.currentindex];

            if(this.currentitem.sel_ans > 0){
                this.showpollres();
            }
        }else{
            this.navCtrl.push(ProfilePage);
        }*/

        this.navCtrl.pop();

    }

    showpollres(){
        this.isLoad = false;

        var link = 'http://torqkd.com/user/ajs2/getpolllllResultnew';
        var data = {poll_id:this.currentitem.ques_id};



        this._http.post(link, data)
            .subscribe(res => {
                this.itemdet = res.json();

                this.newLabels = [];

                for(let n in this.itemdet.answer){
                    this.newLabels.push(this.itemdet.answer[n]+' : '+this.itemdet.voteno[n]);
                }

                this.isLoad = true;
                console.log(this.itemdet);
            }, error => {
                console.log("Oooops!");
                this.navCtrl.pop();
            });
    }

    getpieChartData(item){
        var rarr = [];
        for(let n in item.voteno){
            rarr.push(item.voteno[n]);
        }
        return rarr;
    }

    getpieChartLabels(item){
        var rarr = [];
        for(let n in item.answer){
            rarr.push(item.answer[n]);
        }
        return rarr;
    }

    viewResult(){
        let modal = this.modalCtrl.create(DailypollresultPage, {
            "item": this.currentitem
        });

        modal.present();
    }

    showtermsploicy(type){
        let modal = this.modalCtrl.create(CommonPopupPage, {
            "type": type
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
