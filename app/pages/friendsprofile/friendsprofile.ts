import {Component, ViewChild} from "@angular/core";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Splashscreen, InAppBrowser, SQLite, Network} from "ionic-native";
import {Http, Headers} from "@angular/http";
import {
    Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform, PopoverController,
    ViewController,NavParams,MenuController
} from "ionic-angular";
import * as $ from "jquery";
import {HomePage} from "../home/home";
import {HomevideomodalPage} from "../homevideomodal/homevideomodal";
import {Homevideomodal1Page} from "../homevideomodal1/homevideomodal1";
import {SocialcommentPage} from "../socialcomment/socialcomment";
import {tagpeoplelistPage} from "../tagpeoplelist/tagpeoplelist";
import {socialtaglistPage} from "../socialtaglist/socialtaglist";
import {profileeventlistPage} from "../profileeventlist/profileeventlist";
import {profilegroupPage} from "../profilegroup/profilegroup";
import {profileStatPage} from "../profilestat/profilestat";
import {FbcommentPage} from "../fbcomment/fbcomment";
import {TwcommentPage} from "../twcomment/twcomment";
import {DomSanitizationService} from "@angular/platform-browser";
import { AlertController } from 'ionic-angular';
import { ActionSheetController,ToastController } from 'ionic-angular';
import {Facebook} from 'ionic-native';
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {PhotodetsocialPage} from "../photodetsocial/photodetsocial";

import {ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions,MediaCapture,ScreenOrientation, Transfer,Camera,StreamingMedia, StreamingVideoOptions} from 'ionic-native';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {YtvdoListPage} from '../ytvdolist/ytvdolist';
import {AddroutesPage} from '../addroutes/addroutes';
import {MysportsPage} from '../mysports/mysports';
import {FriendsGrouproupPage} from '../friendsgroup/friendsgroup';
import {FriendsEventPage} from '../friendsevent/friendsevent';
import {FriendsStatPage} from '../friendsstat/friendsstat';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/friendsprofile/friendsprofile.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class FriendsProfilePage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
    public addroutespage = AddroutesPage;
    public mysportspage = MysportsPage;
    public friendsgrouprouppage = FriendsGrouproupPage;
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
    private userid;
    private local:LocalStorage;
    private socialfeedoffset;
    sanitizer;
    //profilePage=ProfilePage;
    public profileeventlistpage = profileeventlistPage;
    public profilegrouppage = profilegroupPage;
    public profilestatpage = profileStatPage;
    public isStatusInput = false;
    public cdatetime;

    public statustype = '';
    public statusvalue = '';
    public tagpeople = '';
    public getExactRunning = false;
    public statusText = '';
    public statusText1 = '';
    public accessToken;
    public test;


    private filepath;
    private imagepath;
    private videopath;
    private msg;
    private msg1;
    private share_with=1;
    public isPhoto = false;
    public photoval = false;
    public videoval = false;
    public youtubeval = false;
    public isVideo = false;
    public status_id;
    public ytsearchkey = '';

    public getuserdetails;

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
    private isInternet;
    public isOfflineData;

    constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,private _navParams: NavParams,public menu: MenuController) {


        this.userid=this._navParams.get("userid");

        this.cdatetime = (new Date).getTime();
        this.status_id =0;
        this.sanitizer=sanitizer;


        this.socialfeedoffset=0;
        this.statusdata=new Array();


        /***********************banner list***************************/
        var link = 'http://torqkd.com/user/ajs2/getProfilebanners';
        var data = {pageid: 3,sp_id:0};

        this._http.post(link, data)
            .subscribe(data => {
                if(data.json()==null){
                    return;
                }else{
                    this.banner1data=data.json().banner1;
                    this.banner2data=data.json().banner2;
                }
            }, error => {
                console.log("Oooops!");
            });
        /***********************banner list***************************/

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




        this.local = new Storage(LocalStorage);

        this.local.get('userinfo').then((value) => {
            this.loggedinuser=JSON.parse(value).id;
            console.log(JSON.parse(value).id);
            if(value!=null) {
                this.loggedinuser=JSON.parse(value).id;
                this.getStatus();
            }else{
                this.loggedinuser = 0;
                this.getStatus();
            }
        }).catch((err)=>{
            this.loggedinuser = 0;
            this.getStatus();
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

    launchVideo(url,poster) {
        let options: StreamingVideoOptions = {
            successCallback: () => {  },
            errorCallback: (e) => {  },
            orientation: 'landscape'
        };

        StreamingMedia.playVideo("http://torqkd.com/uploads/video/converted/"+url, options);
    }
    launchVideo1(videoid) {

        let modal = this.modalCtrl.create(Homevideomodal1Page, {
            "videoid": videoid
        });
        modal.present();
    }


    getStatus(){
        var link1 = 'http://torqkd.com/user/ajs2/getStatusnStat/sess_user/'+this.loggedinuser+'/userid/'+this.userid+'/offset/'+this.socialfeedoffset;
        var data1 = {sess_user :this.loggedinuser ,userid:this.userid};

        this._http.post(link1, data1)
            .subscribe(data => {
                if(data.json()==null){

                    return;
                }
                else{
                    this.statdata=data.json().statdet;
                    let v;

                    if(this.socialfeedoffset>0)
                        this.statusdata=this.statusdata.concat(data.json().status);
                    else this.statusdata=(data.json().status);

                    this.loadmaps(this.statusdata);
                    this.socialfeedoffset+=15;

                }
            }, error => {
                console.log("Oooops!");
            });
    }

    loadmaps(statusd){
        setTimeout(function () {

            var x;
            let map = new Array();
            let poly = new Array();
            let locations = new Array();
            let points = new Array();
            let path = new Array();
            let address = new Array();
            let markers = new Array();
            let bounds = new Array();
            let markerp = new Array();
            let marker;

            for (x in statusd) {
                bounds[statusd[x].id] = new google.maps.LatLngBounds();
                if (statusd[x].type == 'route') {

                    locations[statusd[x].id]=(statusd[x].routes.location);
                    markerp[statusd[x].id]=(statusd[x].routes.marker);


                    var myOptions = {
                        zoom: 10,
                        center: new google.maps.LatLng(52.21454000000001, 0.14044490000003407),
                        mapTypeId: google.maps.MapTypeId.HYBRID,
                        scrollwheel:false,
                        mapTypeControlOptions: {
                            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE]
                        },
                        disableDefaultUI: true
                    }
                    map[statusd[x].id] = new google.maps.Map(document.getElementById('map22'+statusd[x].id), myOptions);


                    poly[statusd[x].id] = new google.maps.Polyline({
                        geodesic: true,
                        strokeColor: '#F7931E',
                        strokeOpacity: 1.0,
                        strokeWeight: 4
                    });

                    var n;
                    path[statusd[x].id] = new google.maps.MVCArray();

                    if(locations[statusd[x].id].length>0)
                    {
                        for(n in locations[statusd[x].id]){
                            var stptggg = locations[statusd[x].id][n];
                            var setcarr = new Array();

                            var curP = new google.maps.LatLng(locations[statusd[x].id][n]['latitude'] , locations[statusd[x].id][n]['longitude']);

                            bounds[statusd[x].id].extend(curP);

                            path[statusd[x].id].push(curP);
                            if(path[statusd[x].id].getLength() === 1) {
                                poly[statusd[x].id].setPath(path[statusd[x].id]);
                                map[statusd[x].id].setCenter(curP);
                                marker = new google.maps.Marker({
                                    map: map[statusd[x].id],
                                    position: curP,
                                    icon:'http://torqkd.com/images/map-icon.png',
                                    //title:address[statusd[x].id]
                                });
                            }
                        }

                        poly[statusd[x].id].setMap(map[statusd[x].id]);

                    }

                    else {
                        var curP = new google.maps.LatLng(markerp[statusd[x].id][0]['latitude'], markerp[statusd[x].id][0]['longitude']);


                        bounds[statusd[x].id].extend(curP);
                        marker = new google.maps.Marker({
                            map: map[statusd[x].id],
                            position: curP,
                            icon:'http://torqkd.com/images/map-icon.png',
                            //title:address[statusd[x].id]
                        });
                    }
                    map[statusd[x].id].fitBounds(bounds[statusd[x].id]);
                    map[statusd[x].id].setZoom( map[statusd[x].id].getZoom());
                    google.maps.event.trigger(map[statusd[x].id], 'resize');

                }
            }
        },5000);

    }

    launch(url){

        InAppBrowser.open(url,  '_system', 'location=yes');
        /* let browser = new InAppBrowser();
         InAppBrowser.open(url, "_system", "location=true");*/
    }

    openmenu(){

        //$('.navmenul').click();
        this.menu.toggle();
    }

    getsantitizedUrl(url){
        return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+url);
    }
    updatelike(itemid){
        var link1 = 'http://torqkd.com/user/ajs2/likestatus/id/'+itemid+'/userid/'+this.loggedinuser;
        var data1 = {userid :this.loggedinuser};

        this._http.post(link1,data1)
            .subscribe(data => {
                if(data.json()==null){

                    return;
                } else{
                    var x;
                    for(x in this.statusdata){
                        if(this.statusdata[x].id==itemid){
                            this.statusdata[x].is_like=data.json().is_like;
                            this.statusdata[x].like_no=data.json().like_no;
                        }

                    }
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    toogleComment(item){
            let modal = this.modalCtrl.create(SocialcommentPage, {
                "item": item,
                            });

            modal.present();
    }

    getyoutubecontent(videoid){
        var content = '<iframe width="99%" height="99%" src="https://www.youtube.com/embed/'+videoid+'" frameborder="0" allowfullscreen></iframe>';
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    delstatus(item){
        let confirm = this.alertCtrl.create({
            title: '',
            message: 'ARE YOU SURE YOU WANT TO DELETE THIS POST?',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.delstatusconfirm(item);
                    }
                },
                {
                    text: 'Cancel',
                    handler: () => {
                        console.log('Cancelled');
                    }
                }
            ]
        });
        confirm.present();
    }

    delstatusconfirm(item){
        var idx1 = this.statusdata.indexOf(item);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var link = 'http://torqkd.com/user/ajs2/delstatus';
        var data = {status_id: item.id};


        this._http.post(link, data)
            .subscribe(data => {
                this.statusdata.splice(idx1,1);
                this.socialfeedoffset = parseInt(this.socialfeedoffset)-1;
            }, error => {
                console.log("Oooops!");
            });
    }

    changesharewithhtml(item) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Who should see this?',
            cssClass : 'sharewithactionsheet',
            buttons: [
                {
                    text: 'Community',
                    cssClass : (item.share_with==1)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(item,1);
                    }
                },{
                    text: 'Friends',
                    cssClass : (item.share_with==2)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(item,2);
                    }
                },{
                    text: 'Friends of Friends',
                    cssClass : (item.share_with==3)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(item,3);
                    }
                },{
                    text: 'private me only',
                    cssClass : (item.share_with==4)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(item,4);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    changesharewithfun(item,valu){
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var link = 'http://torqkd.com/user/ajs2/changeShareWith';
        var data = {status_id: item.id,valu:valu};


        this._http.post(link, data)
            .subscribe(data => {
                item.share_with = valu;
            }, error => {
                console.log("Oooops!");
            });
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

    showtagPeople1(item){
        let modal = this.modalCtrl.create(socialtaglistPage, {
            "item": item.tagpeople,
        });

        modal.present();

    }

    showSocilaShareList(item){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Share',
            cssClass : 'socilashareactionsheet',
            buttons: [
                {
                    text: '',
                    handler: () => {
                        Facebook.login(["email","public_profile"]).then((result) => {

                            if(result.status == 'connected'){
                                this.accessToken = result.authResponse.accessToken;
                                if(item.type == 'image'){
                                    var obj = {
                                        method: "share",
                                        href: 'http://torkq.com/singlepost.php?id='+this.loggedinuser+'&image='+item.value,
                                        display : 'popup'
                                    };
                                    Facebook.showDialog(obj).then((res) => {
                                        let toast = this.toastCtrl.create({
                                            message: 'Posted Successfully On Facebook',
                                            duration: 3000,
                                            position : 'middle',
                                            cssClass : 'social-share-success'
                                        });

                                        toast.present();
                                    });
                                }else if(item.type == 'route'){
                                    alert('route');
                                }else if(item.type == 'mp4'){
//                                    var link = 'http://torqkd.com/user/ajs2/postfbvideo';
//                                    var data = {'accessToken':this.accessToken,'com':item.msg,'value':item.value};
                                    let modal = this.modalCtrl.create(FbcommentPage, {
                                        "item": item, "accessToken" : this.accessToken
                                    });

                                    modal.present();

                                }else if(item.type == 'youtube'){
//                                    var link = 'http://torqkd.com/user/ajs2/postfbYtvideo';
//                                    var data = {'accessToken':this.accessToken,'com':item.msg,'value':item.value};
                                    let modal = this.modalCtrl.create(FbcommentPage, {
                                        "item": item, "accessToken" : this.accessToken
                                    });

                                    modal.present();
                                }else{
                                    var link = 'http://torqkd.com/user/ajs2/postfbText';
                                    var data = {'accessToken':this.accessToken,'com':item.msg,'value':item.value};

                                    this._http.post(link, data)
                                        .subscribe(res => {
                                            let toast = this.toastCtrl.create({
                                                message: 'Posted Successfully On Facebook',
                                                duration: 3000,
                                                position : 'middle',
                                                cssClass : 'social-share-success'
                                            });
                                            toast.present();
                                        }, error => {
                                            let toast = this.toastCtrl.create({
                                                message: 'An Error occured in FB Share',
                                                duration: 3000,
                                                position : 'middle',
                                                cssClass : 'social-share-success'
                                            });
                                            toast.present();
                                        });
                                }





                            }else{
                                alert('An Error occured in FB Login');
                            }




                            /*Facebook.api('/' + result.authResponse.userID + '?fields=id,name,gender,email,first_name,last_name',[]).then((result1) => {
                                console.log(result1);
                                alert(result1);
                                var x;
                                for (x in result1){
                                    alert(x+'---'+result1[x]);
                                    if(Array.isArray(result1[x])){
                                        let y;
                                        for (y in result1[x]) {
                                            alert(y + '' + result1[x][y]);
                                        }
                                    }
                                }


                            });*/



                        });
                    }
                },
                {
                    text: '',
                    handler: () => {

                        var sType = 'text';
                        if(item.type == 'image'){
                            sType = 'statImg';
                        }

                        var inAppBrowserRef;

                        if(item.type == 'image'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "accessToken" : this.accessToken
                            });
                            modal.present();
                        }else if(item.type == 'route'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "accessToken" : this.accessToken
                            });
                            modal.present();
                        }else if(item.type == 'mp4'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "accessToken" : this.accessToken
                            });
                            modal.present();

                        }else if(item.type == 'youtube'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "accessToken" : this.accessToken
                            });
                            modal.present();
                        }else{
                            inAppBrowserRef = InAppBrowser.open('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com='+item.msg+'&userid='+this.loggedinuser+'&type=text', '_system', 'location=yes');
                        }

                    }
                },
                {
                    text: '',
                    handler: () => {
                        var inAppBrowserRef;
                        inAppBrowserRef = new InAppBrowser.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=',  '_system', 'location=yes');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }



    showtermsploicy(type){
        let modal = this.modalCtrl.create(CommonPopupPage, {
            "type": type
        });

        modal.present();
    }

    showPhotoDetails(item){
        let modal = this.modalCtrl.create(PhotodetsocialPage, {
            "item": item,
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


