import {Component, ViewChild} from "@angular/core";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Splashscreen, InAppBrowser, ImagePicker, SQLite, Network} from "ionic-native";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,MenuController} from "ionic-angular";
import * as $ from "jquery";
import {HomePage} from "../home/home";
import {HomevideomodalPage} from "../homevideomodal/homevideomodal";
import {SocialcommentPage} from "../socialcomment/socialcomment";
import {ProfilePage} from "../profile/profile";
import {profileeventlistPage} from "../profileeventlist/profileeventlist";
import {profilegroupPage} from "../profilegroup/profilegroup";
import {tagpeoplelistPage} from "../tagpeoplelist/tagpeoplelist";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {statDetPage} from "../statdet/statdet";
import {DomSanitizationService} from "@angular/platform-browser";
import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import '../../../node_modules/chart.js/src/chart.js';
import { BaseChartComponent } from 'ng2-charts/ng2-charts';
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {MysportsPage} from '../mysports/mysports';
import {FriendsProfilePage} from '../friendsprofile/friendsprofile';
import {FriendsGrouproupPage} from '../friendsgroup/friendsgroup';
import {FriendsEventPage} from '../friendsevent/friendsevent';

//import {ProfilePage} from '../profile/profile'
//import * as $ from "jquery";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/friendsstat/friendsstat.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,BaseChartComponent]
})
export class FriendsStatPage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
    public mysportspage = MysportsPage;
    public friendsprofilepage = FriendsProfilePage;
    public friendsgrouprouppage = FriendsGrouproupPage;
    public friendseventpage = FriendsEventPage;
    @ViewChild(Nav) nav: Nav;
    @ViewChild(Content)
    content:Content;
    public _loginUrl:string = "http://torkq.com/login";
    private loginForm:FormGroup;
    public banner1data;
    public banner2data;
    private data;
    private isloggedin;
    private data1;
    private statdata;
    private statusdata;
    private loggedinuser;
    private userid;
    private local:LocalStorage;
    sanitizer;
    public profilepage=ProfilePage;
    public profileeventlistpage=profileeventlistPage;
    public profilegrouppage=profilegroupPage;
    public isStatusInput = false;
    public statustype = '';
    public statusvalue = '';
    public tagpeople = '';
    public getExactRunning = false;
    public statusText1 = '';
    public groupList;
    public groupcount;
    public statdata2;
    public statcount;


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


    mySlideOptions = {
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

    private getuserdetails;
    private isInternet;
    public isOfflineData;

    constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,private _navParams: NavParams,public menu: MenuController) {

        this.userid=this._navParams.get("userid");

        this.sanitizer=sanitizer;

        var link = 'http://torqkd.com/user/ajs2/getProfilebanners';
        var data = {pageid: 3,sp_id:0};



        this._http.post(link, data)
            .subscribe(data => {
                if(data.json()==null){

                    return;
                }
                else{

                    this.banner1data=data.json().banner1;
                    this.banner2data=data.json().banner2;

                }
            }, error => {
                console.log("Oooops!");
            });


        /***********************banner list***************************/
        var link1 = 'http://torqkd.com/user/ajs2/getuserdetailsnew5';
        var data1 = {userid: this.userid};

        this._http.post(link1, data1)
            .subscribe(data => {
                if(data.json()==null){
                    return;
                }else{
                    this.getuserdetails=data.json();
                }
            }, error => {
                console.log("Oooops!");
            });
        /***********************banner list***************************/




        /*****************Get User Stat[start]**********************/
        var link5 = 'http://torqkd.com/user/ajs2/getUserStat';
        var data5 = {userid: this.userid};

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

        /***********************userdetails**************************/
        var link1 = 'http://torqkd.com/user/ajs2/getuserdetailsnew5';
        var data1 = {userid: this.userid};

        this._http.post(link1, data1)
            .subscribe(data => {
                if(data.json()==null){
                    return;
                }else{
                    this.getuserdetails=data.json();
                }
            }, error => {
                console.log("Oooops!");
            });
        /***********************userdetails**************************/


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
/*
        let browser = new InAppBrowser();
        InAppBrowser.open(url, "_system", "location=true");
*/    }

    openmenu(){
        //$('.navmenul').click();
        this.menu.toggle();
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

    showtermsploicy(type){
        let modal = this.modalCtrl.create(CommonPopupPage, {
            "type": type
        });

        modal.present();
    }
    getsanitizerstyle(imgsrc){
        return this.sanitizer.bypassSecurityTrustStyle('url(' + imgsrc + ')');
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



