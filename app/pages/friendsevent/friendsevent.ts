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
import {profilegroupPage} from "../profilegroup/profilegroup";
import {profileStatPage} from "../profilestat/profilestat";
import {eventDetailsPage} from "../eventdetails1/eventdetails1";
import {tagpeoplelistPage} from "../tagpeoplelist/tagpeoplelist";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {DomSanitizationService} from "@angular/platform-browser";
import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
//import {ProfilePage} from '../profile/profile'
//import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {MysportsPage} from '../mysports/mysports';
import {FriendsProfilePage} from '../friendsprofile/friendsprofile';
import {FriendsGrouproupPage} from '../friendsgroup/friendsgroup';
import {FriendsStatPage} from '../friendsstat/friendsstat';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/friendsevent/friendsevent.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class FriendsEventPage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
    public mysportspage = MysportsPage;
    public friendsprofilepage = FriendsProfilePage;
    public friendsgrouprouppage = FriendsGrouproupPage;
    public friendsstatpage = FriendsStatPage;
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
    private eventdata;
    private loggedinuser;
    private local:LocalStorage;
    private eventoffset;
    sanitizer;
    public profilepage=ProfilePage;
    public profilegrouppage = profilegroupPage;
    public profilestatpage = profileStatPage;
    public eventdetailspage = eventDetailsPage;
    public isStatusInput = false;
    public statustype = '';
    public statusvalue = '';
    public tagpeople = '';
    public getExactRunning = false;
    public statusText1 = '';
    public eventlist;
    public totalevent;
    public eventcount;

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
    public getuserdetails;
    public userid;

    private isInternet;
    public isOfflineData;


    constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,private _navParams: NavParams,public menu: MenuController) {

        this.userid=this._navParams.get("userid");

        this.sanitizer=sanitizer;

        this.eventoffset = 0;
        this.eventdata = [];

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


        this.local = new Storage(LocalStorage);

        this.local.get('userinfo').then((value) => {
            this.loggedinuser=JSON.parse(value).id;
            console.log(JSON.parse(value).id);
            if(value!=null) {
                this.loggedinuser=JSON.parse(value).id;
                this.getEvents();
            }
            else{
                this.loggedinuser=0;
                this.getEvents();
            }
        }).catch((err)=>{
            this.loggedinuser = 0;
            this.getEvents();
        });


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


    getEvents(){
        var link = 'http://torqkd.com/user/ajs2/getEvents';
        var data = {offset: this.eventoffset,sess_user:this.loggedinuser,userid:this.userid};


        this._http.post(link, data)
            .subscribe(res => {
                var res2 = res.json();
                this.eventlist = res2.event;
                this.totalevent = res2.totalCount;
                this.eventcount = this.eventlist.length;
                this.eventoffset = parseInt(this.eventoffset)+5;
            }, error => {
                console.log("Oooops!");
            });

    }

    getMoreEvents(){
        var link = 'http://torqkd.com/user/ajs2/getEvents';
        var data = {offset: this.eventoffset,sess_user:this.loggedinuser,userid:this.userid};


        this._http.post(link, data)
            .subscribe(res => {
                var res2 = res.json();
                this.eventlist=this.eventlist.concat(res2.event);
                this.eventcount = this.eventlist.length;
                this.eventoffset = parseInt(this.eventoffset)+5;
            }, error => {
                console.log("Oooops!");
            });

    }


    launch(url){

/*        let browser = new InAppBrowser();
        InAppBrowser.open(url, "_system", "location=true");*/
    }

    openmenu(){
        //$('.navmenul').click();
        this.menu.toggle();
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


    showtermsploicy1(type){
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



