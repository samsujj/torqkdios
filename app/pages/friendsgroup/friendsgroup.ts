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
import {profileStatPage} from "../profilestat/profilestat";
import {tagpeoplelistPage} from "../tagpeoplelist/tagpeoplelist";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {DomSanitizationService} from "@angular/platform-browser";
import { AlertController } from 'ionic-angular';
import { ActionSheetController,LoadingController } from 'ionic-angular';
//import {ProfilePage} from '../profile/profile'
//import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {GroupdetailsPage} from "../groupdetails/groupdetails";
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {MysportsPage} from '../mysports/mysports';
import {FriendsProfilePage} from '../friendsprofile/friendsprofile';
import {FriendsEventPage} from '../friendsevent/friendsevent';
import {FriendsStatPage} from '../friendsstat/friendsstat';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/friendsgroup/friendsgroup.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class FriendsGrouproupPage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
    public mysportspage = MysportsPage;
    public friendsprofilepage = FriendsProfilePage;
    public friendseventpage = FriendsEventPage;
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
    private loggedinuser;
    private local:LocalStorage;
    sanitizer;
    public profilepage=ProfilePage;
    public profileeventlistpage=profileeventlistPage;
    public profilestatpage = profileStatPage;
    public groupdetailspage = GroupdetailsPage;
    public isStatusInput = false;
    public statustype = '';
    public statusvalue = '';
    public tagpeople = '';
    public getExactRunning = false;
    public statusText1 = '';
    public groupList;
    public groupcount;

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


    constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public loadingCtrl: LoadingController,private _navParams: NavParams,public menu: MenuController) {
        this.sanitizer=sanitizer;

        this.userid=this._navParams.get("userid");


        this.getGroups();

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


    getGroups(){

        var link = 'http://torqkd.com/user/ajs2/getGroups';
        var data = {userid: this.userid};


        this._http.post(link, data)
            .subscribe(res => {
                var res2 = res.json();
                this.groupList = res2;
                this.groupcount = res2.length;


            }, error => {
                console.log("Oooops!");



            });

    }
    getlocGroups(){
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();

        var link = 'http://torqkd.com/user/ajs2/getLocGroups';
        var data = {userid: this.userid};


        this._http.post(link, data)
            .subscribe(res => {
                var res2 = res.json();
                this.groupList = res2;
                this.groupcount = res2.length;
                loading.dismiss();
            }, error => {
                console.log("Oooops!");
                loading.dismiss();
            });

    }
    getsugGroups(){
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        var link = 'http://torqkd.com/user/ajs2/getSugGroups';
        var data = {userid: this.userid};


        this._http.post(link, data)
            .subscribe(res => {
                var res2 = res.json();
                this.groupList = res2;
                this.groupcount = res2.length;
                loading.dismiss();
            }, error => {
                console.log("Oooops!");
                loading.dismiss();
            });

    }

    launch(url){

  /*      let browser = new InAppBrowser();
        InAppBrowser.open(url, "_system", "location=true");
*/    }

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



