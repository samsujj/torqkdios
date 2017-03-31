import {Component, ViewChild} from "@angular/core";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Splashscreen, InAppBrowser, Network, SQLite} from "ionic-native";
import {Http, Headers} from "@angular/http";
import { Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform, PopoverController,MenuController,ViewController
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
//import {ProfilePage} from '../profile/profile'
//import * as $ from "jquery";
//import {CommonPopupService} from  '../../services/common.popup.ts'
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {PhotodetsocialPage} from "../photodetsocial/photodetsocial";

import {ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions,MediaCapture,ScreenOrientation, Transfer,Camera,StreamingMedia, StreamingVideoOptions} from 'ionic-native';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {YtvdoListPage} from '../ytvdolist/ytvdolist';
import {AddroutesPage} from '../addroutes/addroutes';
import {RouteDetailsPage} from '../routedetails/routedetails';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/profile/profile.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class ProfilePage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
    public addroutespage = AddroutesPage;
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


    public isRotate;
    public rotating;

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

    constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,public menu: MenuController) {

        /*if (Splashscreen) {
            setTimeout(() => {
                Splashscreen.hide();
            }, 100);
        }*/


        this.cdatetime = (new Date).getTime();
        this.status_id =0;
        this.sanitizer=sanitizer;
        this.loginForm = fb.group({
            email: ["", Validators.required],
            password: ["", Validators.required]
        });




        platform.registerBackButtonAction(() => {
            //alert('in app.ts');

            this.navCtrl.pop();

        });

        this.socialfeedoffset=0;
        this.statusdata=new Array();





        this.local = new Storage(LocalStorage);

        this.local.get('userinfo').then((value) => {

            this.loggedinuser=JSON.parse(value).id;
            if(value!=null) {
                this.isloggedin=true;
                $('.has-header').removeClass('hide');
            }
            else{
                $('ion-content').removeClass('hide');
                this.isloggedin=false;
            }
        });








    }

    launchVideo(url,poster) {
        let options: StreamingVideoOptions = {
            successCallback: () => {  },
            errorCallback: (e) => {  },
            orientation: 'landscape'
        };

        StreamingMedia.playVideo("http://torqkd.com/uploads/video/converted/"+url, options);

        /*


        let modal = this.modalCtrl.create(HomevideomodalPage, {
            "url": "http://torqkd.com/uploads/video/converted/"+url,
            "poster": poster
        });

        modal.present();*/
    }
    launchVideo1(videoid) {

        let modal = this.modalCtrl.create(Homevideomodal1Page, {
            "videoid": videoid
        });
        modal.present();
    }


    ionViewDidEnter() {

        if (Splashscreen) {
            setTimeout(() => {
                Splashscreen.hide();
            }, 10);
        }

     //   console.log(this.isloggedin);
        if(!this.isloggedin)this.navCtrl.setRoot(HomePage);
        else{



            /************************Check Internet [start]*****************************/
            this.platform.ready().then(() => {

                if(Network.connection === 'none'){
                    this.isInternet = 0;
                }else{
                    this.isInternet = 1;
                }

                this.getStatusdata();
                this.getBannerData();
                this.isOfflineData = 0;
                this.checkOfflineData();

                let disconnectSubscription = Network.onDisconnect().subscribe(() => {
                    this.isInternet = 0;

                    this.getStatusdata();
                    this.getBannerData();

                });

                let connectSubscription = Network.onConnect().subscribe(() => {
                    this.isInternet = 1;

                    this.getStatusdata();
                    this.getBannerData();

                });

            });
            /************************Check Internet [end]*******************************/

        }

    }

    getBannerData(){
        this.getFromdb('profileBanner1data');
        this.getFromdb('profileBanner2data');

        console.log(this.isInternet);

        if(this.isInternet == 1){

            console.log(1);

            var link = 'http://torqkd.com/user/ajs2/getProfilebanners';
            var data = {pageid: 3,sp_id:0};



            this._http.post(link, data)
                .subscribe(data => {
                    // /this.data1.response = data.json();
                    //console.log(data);
                    if(data.json()==null){
                        //this.verifylogin=false;
                        return;
                    }
                    else{
                        this.banner1data=data.json().banner1;
                        this.banner2data=data.json().banner2;

                        this.opendatase('profileBanner1data');
                        this.opendatase('profileBanner2data');

                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }


    getStatusdata(){
        this.getFromdb('profileStatdata');
        this.getFromdb('profileStatusdata');


        if(this.isInternet == 1){

            var link1 = 'http://torqkd.com/user/ajs2/getStatusnStat/sess_user/'+this.loggedinuser+'/userid/'+this.loggedinuser+'/offset/'+this.socialfeedoffset;
            var data1 = {sess_user :this.loggedinuser ,userid:this.loggedinuser};

            this._http.post(link1, data1)
                .subscribe(data => {

                    if(data.json()==null){
                        return;
                    } else{

                        this.statdata=data.json().statdet;
                        this.statusdata=(data.json().status);
                        this.socialfeedoffset+=15;

                        this.opendatase('profileStatdata');
                        this.opendatase('profileStatusdata');

                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }

    viewmorestatus(){
        var link1 = 'http://torqkd.com/user/ajs2/getStatusnStat/sess_user/'+this.loggedinuser+'/userid/'+this.loggedinuser+'/offset/'+this.socialfeedoffset;
        var data1 = {sess_user :this.loggedinuser ,userid:this.loggedinuser};

        this._http.post(link1, data1)
            .subscribe(data => {

                if(data.json()==null){
                    return;
                } else{

                    if(this.socialfeedoffset>0)
                        this.statusdata=this.statusdata.concat(data.json().status);
                    this.socialfeedoffset+=15;

                }
            }, error => {
                console.log("Oooops!");
            });
    }


    loadmaps(statusd){

        setTimeout(() => {

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

                    var curP = new google.maps.LatLng(markerp[statusd[x].id][0]['latitude'], markerp[statusd[x].id][0]['longitude']);


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


                    var elems = document.getElementsByClassName('map-canvas-profile'+statusd[x].id);
                    var elemlength = elems.length;

                    map[statusd[x].id] = new google.maps.Map(elems[elemlength-1], myOptions);


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
        }, 5000);


    }



    launch(url){

        let browser = new InAppBrowser(url, '_system');

   //     InAppBrowser.open(url,  '_system', 'location=yes');


        /* let browser = new InAppBrowser();
         InAppBrowser.open(url, "_system", "location=true");*/
    }

    openmenu(){
        //$('.navmenul').click();
        this.menu.toggle();
    }


    onPageScroll(event) {
    }

    ngAfterViewInit() {
        this.content.addScrollListener(this.onPageScroll);
    }




    makeGetRequest() {
        this._http.get("https://httpbin.org/ip")
            .subscribe(data => {
              //  console.log(data.json());
                // /alert(data.json());
                //this.nav.present(alert);
            }, error => {
               // console.log(JSON.stringify(error.json()));
            });
    }



    /*openphotobowse(){

        let options = {
            // max images to be selected, defaults to 15. If this is set to 1, upon
            // selection of a single image, the plugin will return it.
            maximumImagesCount: 80,

            // max width and height to allow the images to be.  Will keep aspect
            // ratio no matter what.  So if both are 800, the returned image
            // will be at most 800 pixels wide and 800 pixels tall.  If the width is
            // 800 and height 0 the image will be 800 pixels wide if the source
            // is at least that wide.
            width: 200,
            height: 200,

            // quality of resized image, defaults to 100
            quality: 90
        };
        ImagePicker.getPictures(options).then((results) => {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                alert('Image URI: ' + results[i]);
                $('.photopreview').attr('src',results[i]);
            }
        }, (err) => { });
    }*/

    getsantitizedUrl(url){
        //console.log('url'+url);
        return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+url);
    }
    updatelike(itemid){
       // console.log(itemid);

        var link1 = 'http://torqkd.com/user/ajs2/likestatus/id/'+itemid+'/userid/'+this.loggedinuser;
        //var data = $.param({email: event.email,password:event.password});
        //var data = JSON.stringify({email: event.email,password:event.password});
        var data1 = {userid :this.loggedinuser};



        this._http.post(link1,data1)
            .subscribe(data => {
                // /this.data1.response = data.json();
                //console.log(data);
                if(data.json()==null){
                    //this.verifylogin=false;

                    return;
                }
                else{


                    //console.log(data.json());
                   // console.log(this.statusdata);
                    var x;
                    for(x in this.statusdata){
                        if(this.statusdata[x].id==itemid){
                            this.statusdata[x].is_like=data.json().is_like;
                            this.statusdata[x].like_no=data.json().like_no;
                        }

                    }

                    //this.statusdata[itemid]['is_like']=datavalue.is_like;
                    //this.statusdata[itemid]['is_like']=datavalue.is_like;


                }
            }, error => {
                console.log("Oooops!");
            });
    }

    toogleComment(item){
       /*     let modal = this.modalCtrl.create(SocialcommentPage, {
                "item": item,
                            });

            modal.present();
       */

        this.navCtrl.push(SocialcommentPage, { "item": item });

    }

    getyoutubecontent(videoid){
        var content = '<iframe width="99%" height="99%" src="https://www.youtube.com/embed/'+videoid+'" frameborder="0" allowfullscreen></iframe>';
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }



    delstatus(item){
        let confirm = this.alertCtrl.create({
            title: '',
            message: 'Are you sure delete this post?',
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

    texthighlight(event){

        var highheight = 58;
        if(document.getElementById("statusuparea").scrollHeight > highheight)
            highheight = document.getElementById("statusuparea").scrollHeight;

        $('.highlightTextarea').css('height',highheight);
        $('.highlightTextarea-container').css('height',highheight);
        $('.highlightTextarea-highlighter').css('height',highheight);


        var strss = $('#statusuparea').text();

        var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches ;

        while (match = re.exec(strss)) {

              var hastag = '#'+match[1];

            $('#text-box').find('.highlightTextarea-highlighter').html($('#statusuparea').text().replace(hastag,'<span style="color:#fff;background-color:#F7931D; z-index: 9; position: relative;">'+hastag+'</span>'));
        }

        var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        if(match_url.test(strss) && (event.keyCode == 13 || event.keyCode == 32) && !this.getExactRunning){
            this.getExactRunning = true;
            var extracted_url = strss.match(match_url)[0];
           // console.log(extracted_url);
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var link = 'http://torqkd.com/user/ajs2/extratcUrl';
            var data5 = {url: extracted_url};

            this._http.post(link, data5)
                .subscribe(data1 => {
                    this.getExactRunning = false;

                    var data = data1.json();

                    var total_images = parseInt(data.images.length)-1;
                    var img_arr_pos = 0;

                    if(data.title != '' && data.title != null){


                        var content = '';
                        var content1 = '';

                        content += '<div class="extracted_url">';
                        content1 += '<div class="extracted_url extracted_url2">';

                        if(data.images.length > 0){
                            content += '<div class="extracted_thumb" id="extracted_thumb">';
                            content += '<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a>';
                            content += '<img src="'+data.images[img_arr_pos]+'"></div>';
                            content1 += '<div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div>';
                            if(data.images.length > 1) {
                                content += '<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div>';
                            }
                        }
                        content += '<div class="extracted_content">';
                        content += '<a href="javascript:void(0)"  id="extracted_close2" class="extracted_close2"><img src="images/close-img.png" /></a>';
                        content += '<h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                        content1 += '<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                        content += '<p>'+data.description+'</p>';
                        content1 += '<p>'+data.description+'</p>';
                        content += '<div class="clear"></div></div>';
                        content1 += '<div class="clear"></div></div>';
                        content += '<div class="clear"></div></div>';
                        content1 += '<div class="clear"></div></div>';


                        $( '#extracted_url' ).html(content);

                        this.statusText1 = content1;
                    }
                    $("#thumb_prev").click( function(e){
                        if(img_arr_pos>0)
                        {
                            img_arr_pos--;
                            $("#extracted_thumb").html('<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a><img src="'+data.images[img_arr_pos]+'">');
                        }

                        this.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                    });
                    $("#thumb_next").click( function(e){
                        if(img_arr_pos<total_images)
                        {
                            img_arr_pos++; //thmubnail array position increment
                            $("#extracted_thumb").html('<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a><img src="'+data.images[img_arr_pos]+'">');
                        }

                        this.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                    });

                    $('#extracted_close1').click(function(){
                        $( '#extracted_thumb' ).remove();
                        $( '.thumb_sel' ).remove();
                        this.statusText1 = '<div class="extracted_url"><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                    });

                    $('#extracted_close2').click(function(){
                        $( '#extracted_url' ).html('');
                        this.statusText1 = '';
                    });

                }, error => {
                    this.getExactRunning = false;
                });
        }

    }

    showtagPeople(){
        let modal = this.modalCtrl.create(tagpeoplelistPage, {
            "item": this.tagpeople,
        });

        modal.present();

    }

    showtagPeople1(item){
        let modal = this.modalCtrl.create(socialtaglistPage, {
            "item": item.tagpeople,
        });

        modal.present();

    }

    statuscancel(){
        $('#text-box').find('.highlightTextarea-highlighter').html('');
        $('.highlightTextarea').css('height',58);
        $('.highlightTextarea-container').css('height',58);
        $('.highlightTextarea-highlighter').css('height',58);
        this.isStatusInput = false;

        $('#statusuparea').text('');
        $( '#extracted_url' ).html('');

        this.statusText = '';
        this.statusText1 = '';
        this.statustype = '';
        this.statusvalue = '';
        this.tagpeople = '';

        this.filepath = '';
        this.imagepath = '';
        this.videopath = '';
        this.isPhoto = false;
        this.isVideo = false;
        this.photoval = false;
        this.videoval = false;
        this.youtubeval = false;
        this.status_id = 0;
    }

    changestatustext(keyval){
        this.statusText = keyval;
    }

    changesharewith(ev){
        this.share_with = ev;
    }

    statusupdate(){

        if(this.statustype == 'mp4'){
            this.statustype = 'video';
            this.localvideoupload();

            return false;
        }

        if(this.statustype == 'mp41'){
            this.statustype = 'video';
            this.localvideoupload1();

            return false;
        }

        if(this.statustype == 'cameraphoto'){
            this.statustype = 'image';
            this.cameraimgupload2();

            return false;
        }

        if(this.statustype == 'cameraphoto1'){
            this.statustype = 'image';
            this.cameraimgupload21();

            return false;
        }

        var msg = this.statusText;

        if(msg != '' || this.statusvalue !=''){

            this.local = new Storage(LocalStorage);

            this.local.get('tagpeoplelist').then((value) => {
                this.tagpeople = value;

                var msg1 = this.statusText1;
                var group_id = 0;


                var headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                var data = {'msg':msg,'msg1':msg1,'share_with':this.share_with,'group_id':group_id,'type':this.statustype,'value':this.statusvalue,'is_status':1,tagpeople:this.tagpeople,'sess_user':this.loggedinuser,'status_id':0};

                this._http.post(link, data)
                    .subscribe(data => {
                        this.statusdata.splice(0, 0,data.json());
                        //this.loadmaps(this.statusdata);
                        this.socialfeedoffset+=1;

                        $('#text-box').find('.highlightTextarea-highlighter').html('');
                        $('.highlightTextarea').css('height',58);
                        $('.highlightTextarea-container').css('height',58);
                        $('.highlightTextarea-highlighter').css('height',58);
                        this.isStatusInput = false;

                        $('#statusuparea').text('');
                        $( '#extracted_url' ).html('');

                        this.statusText = '';
                        this.statusText1 = '';
                        this.statustype = '';
                        this.statusvalue = '';
                        this.tagpeople = '';

                        this.filepath = '';
                        this.imagepath = '';
                        this.videopath = '';
                        this.isPhoto = false;
                        this.isVideo = false;
                        this.photoval = false;
                        this.videoval = false;
                        this.youtubeval = false;

                        this.status_id = 0;

                    }, error => {
                        console.log("Oooops!");
                    });
            });

            this.local = new Storage(LocalStorage);
            this.local.remove('tagpeoplelist');
        }else{
            alert("Please write status or upload video/imnage");
        }


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
                                    var obj = {
                                        method: "share",
                                        href: 'http://torkq.com/singlepost.php?id='+this.loggedinuser+'&route_image='+item.routes.image_name,
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
                                "item": item, "loggedinuser" : this.loggedinuser
                            });
                            modal.present();
                        }else if(item.type == 'route'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "loggedinuser" : this.loggedinuser
                            });
                            modal.present();
                        }else if(item.type == 'mp4'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "loggedinuser" : this.loggedinuser
                            });
                            modal.present();

                        }else if(item.type == 'youtube'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item, "loggedinuser" : this.loggedinuser
                            });
                            modal.present();
                        }else{
                            //inAppBrowserRef = InAppBrowser.open('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com='+item.msg+'&userid='+this.loggedinuser+'&type=text', '_system', 'location=yes');

                            let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare2?image='+item.value+'&page=profile&com='+item.msg+'&userid='+this.loggedinuser+'&type=text', '_blank');


                        }

                    }
                },
                {
                    text: '',
                    handler: () => {
                        var inAppBrowserRef;
                        //inAppBrowserRef = new InAppBrowser.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=',  '_system', 'location=yes');

                        let browser = new InAppBrowser('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=', '_blank');
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
        /*let modal = this.modalCtrl.create(PhotodetsocialPage, {
            "item": item,
        });

        modal.present();*/
        this.navCtrl.push(PhotodetsocialPage, { "item": item});

    }

    showRouteDetails(item){
        /*let modal = this.modalCtrl.create(RouteDetailsPage, {
            "item": item.routes,
        });

        modal.present();*/
        this.navCtrl.push(RouteDetailsPage, { "item": item.routes});
    }

    openphotodiv(){
        this.statusText = '';
        this.statusText1 = '';
        this.statustype = '';
        this.statusvalue = '';
        this.tagpeople = '';
        this.videopath = '';
        this.filepath = '';
        this.imagepath = '';

        this.photoval = false;
        this.videoval = false;
        this.youtubeval = false;
        this.isVideo = false;
        this.isPhoto = true;
    }

    addPhoto(){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Upload Image',
            cssClass : 'photoSheet',
            buttons: [
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        this.opencamera();
                    }
                },{
                    text: 'Gallery',
                    icon: 'photos',
                    handler: () => {
                        this.openphotobowse();
                    }
                }
            ]
        });
        actionSheet.present();
    }

    opencamera(){
        let options: CaptureImageOptions = { limit: 1 };
        MediaCapture.captureImage(options)
            .then(
                (data: MediaFile[]) => {
                    this.imagepath= data[0]['fullPath'];
                    this.filepath = data[0]['fullPath'];
                    this.isPhoto = false;
                    this.isStatusInput = true;
                    this.photoval = true;
                    this.statustype = 'cameraphoto';

                    this.isRotate = 0;


                   // this.uploadpic2();
                },
                (err: CaptureError) => {
                }
            );
    }

    cameraimgupload2(){
        var msg = this.statusText;

        var link = 'http://torqkd.com/user/ajs2/storelocalfilepath';
        var data = {'msg':msg,'msg1':this.statusText1,'share_with':this.share_with,'group_id':0,'type':'image','value':'','is_status':1,tagpeople:this.tagpeople,'sess_user':this.loggedinuser,localfilepath:this.filepath};

        this._http.post(link, data)
            .subscribe(data2 => {

                $('#text-box').find('.highlightTextarea-highlighter').html('');
                $('.highlightTextarea').css('height',58);
                $('.highlightTextarea-container').css('height',58);
                $('.highlightTextarea-highlighter').css('height',58);
                this.isStatusInput = false;
                this.photoval = false;

                $('#statusuparea').text('');
                $( '#extracted_url' ).html('');


                this.status_id = data2.text();
                this.statustype = '';


                var status_id = data2.text();

                this.uploadpic2(status_id);

            }, error => {
                console.log("Oooops!");
            });
    }

    cameraimgupload21(){
        var msg = this.statusText;

        var link = 'http://torqkd.com/user/ajs2/storelocalfilepath';
        var data = {'msg':msg,'msg1':this.statusText1,'share_with':this.share_with,'group_id':0,'type':'image','value':'','is_status':1,tagpeople:this.tagpeople,'sess_user':this.loggedinuser,localfilepath:this.filepath};

        this._http.post(link, data)
            .subscribe(data2 => {

                $('#text-box').find('.highlightTextarea-highlighter').html('');
                $('.highlightTextarea').css('height',58);
                $('.highlightTextarea-container').css('height',58);
                $('.highlightTextarea-highlighter').css('height',58);
                this.isStatusInput = false;
                this.photoval = false;

                $('#statusuparea').text('');
                $( '#extracted_url' ).html('');


                this.status_id = data2.text();
                this.statustype = '';


                var status_id = data2.text();

                this.uploadpic(status_id);

            }, error => {
                console.log("Oooops!");
            });
    }

    uploadpic2(status_id){

        const fileTransfer = new Transfer();
        var options: any;

        options = {
            fileKey: 'file',
            //fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.demo866280/cache/',''),
            fileName: this.imagepath.toString().replace('file:/storage/emulated/0/Pictures/',''),
            headers: {}

        }
        //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
        fileTransfer.upload(this.imagepath, "http://166.62.34.31:2/uploads", options)
            .then((data) => {
                // success

                var data1:any = JSON.parse(data.response);

                if(data1.error_code == 0){
                    this.statusvalue = data1.filename;
                    var link = 'http://torqkd.com/user/ajs2/movefile';
                    var data5 = {file_name: data1.filename,folder_name : 'status_img'};



                    this._http.post(link, data5)
                        .subscribe(data11 => {


                            var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                            var data511 = {'value':data1.filename,'status_id':status_id};

                            this._http.post(link, data511)
                                .subscribe(data => {
                                    this.statusdata.splice(0, 0,data.json());
                                    //this.loadmaps(this.statusdata);
                                    this.socialfeedoffset+=1;

                                    $('#text-box').find('.highlightTextarea-highlighter').html('');
                                    $('.highlightTextarea').css('height',58);
                                    $('.highlightTextarea-container').css('height',58);
                                    $('.highlightTextarea-highlighter').css('height',58);
                                    this.isStatusInput = false;

                                    $('#statusuparea').text('');
                                    $( '#extracted_url' ).html('');

                                    this.statusText = '';
                                    this.statusText1 = '';
                                    this.statustype = '';
                                    this.statusvalue = '';
                                    this.tagpeople = '';

                                    this.filepath = '';
                                    this.imagepath = '';
                                    this.videopath = '';
                                    this.isPhoto = false;
                                    this.isVideo = false;
                                    this.photoval = false;
                                    this.videoval = false;
                                    this.youtubeval = false;

                                    this.status_id = 0;

                                }, error => {
                                    console.log("Oooops!");
                                });




                        }, error => {
                            console.log("Oooops!");
                        });
                }else{
                    alert('error occured');
                }



            }, (err) => {
                // error
                alert(err);
                //this.statuscancel();
            })
    }

    openphotobowse(){
        let options = {
            // max images to be selected, defaults to 15. If this is set to 1, upon
            // selection of a single image, the plugin will return it.
            maximumImagesCount: 80,

            // max width and height to allow the images to be.  Will keep aspect
            // ratio no matter what.  So if both are 800, the returned image
            // will be at most 800 pixels wide and 800 pixels tall.  If the width is
            // 800 and height 0 the image will be 800 pixels wide if the source
            // is at least that wide.
            width: 1000,
            height: 0,

            // quality of resized image, defaults to 100
            quality: 90
        };

        //noinspection TypeScriptUnresolvedFunction
        ImagePicker.getPictures(options).then((results) => {
            for (var i = 0; i < results.length; i++) {
                this.imagepath=results[i];
                this.filepath= results[i];
                this.isPhoto = false;
                this.isStatusInput = true;
                this.photoval = true;

                this.statustype = 'cameraphoto1';
                this.isRotate = 0;


            }
        }, (err) => {
            alert(err);

        });
    }

    uploadpic(status_id){


        const fileTransfer = new Transfer();
        var options: any;

        options = {
            fileKey: 'file',
            //fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.demo866280/cache/',''),
            fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.torkq502502/cache/',''),
            headers: {}

        }
        //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
        fileTransfer.upload(this.imagepath, "http://166.62.34.31:2/uploads", options)
            .then((data) => {
                // success

                var data1:any = JSON.parse(data.response);



                if(data1.error_code == 0){
                    this.statusvalue = data1.filename;
                    var link = 'http://torqkd.com/user/ajs2/movefile';
                    var data5 = {file_name: data1.filename,folder_name : 'status_img'};



                    this._http.post(link, data5)
                        .subscribe(data11 => {

                            var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                            var data511 = {'value':data1.filename,'status_id':status_id};

                            this._http.post(link, data511)
                                .subscribe(data => {
                                    this.statusdata.splice(0, 0,data.json());
                                   // this.loadmaps(this.statusdata);
                                    this.socialfeedoffset+=1;

                                    $('#text-box').find('.highlightTextarea-highlighter').html('');
                                    $('.highlightTextarea').css('height',58);
                                    $('.highlightTextarea-container').css('height',58);
                                    $('.highlightTextarea-highlighter').css('height',58);
                                    this.isStatusInput = false;

                                    $('#statusuparea').text('');
                                    $( '#extracted_url' ).html('');

                                    this.statusText = '';
                                    this.statusText1 = '';
                                    this.statustype = '';
                                    this.statusvalue = '';
                                    this.tagpeople = '';

                                    this.filepath = '';
                                    this.imagepath = '';
                                    this.videopath = '';
                                    this.isPhoto = false;
                                    this.isVideo = false;
                                    this.photoval = false;
                                    this.videoval = false;
                                    this.youtubeval = false;

                                    this.status_id = 0;

                                }, error => {
                                    console.log("Oooops!");
                                });

                        }, error => {
                            console.log("Oooops!");
                        });
                }else{
                    alert('error occured');
                }



            }, (err) => {
                // error
                alert(err);
                //this.statuscancel();
            })
    }

    imgRotate(type){

        this.statustype = 'image';

        if(this.isRotate == 0){
            const fileTransfer = new Transfer();
            var options: any;

            this.rotating = true;

            options = {
                fileKey: 'file',
                //fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.demo866280/cache/',''),
                fileName: this.imagepath.substring(this.imagepath.lastIndexOf('/')+1),
                headers: {}

            }
            //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
            fileTransfer.upload(this.imagepath, "http://166.62.34.31:2/uploads", options)
                .then((data) => {
                    // success

                    var data1:any = JSON.parse(data.response);

                    if(data1.error_code == 0){
                        this.statusvalue = data1.filename;
                        var link = 'http://torqkd.com/user/ajs2/movefile';
                        var data5 = {file_name: data1.filename,folder_name : 'status_img'};



                        this._http.post(link, data5)
                            .subscribe(data11 => {


                                this.statusvalue = data1.filename;

                                this.imgRotate2(type);

                                this.isRotate = 1;


                            }, error => {
                                console.log("Oooops!");
                            });
                    }else{
                        alert('error occured');
                    }



                }, (err) => {
                    // error
                    alert(err);
                    //this.statuscancel();
                })
        }else {
            this.imgRotate2(type);
        }



    }

    imgRotate2(type){
        var link = 'http://torqkd.com/user/ajs2/rotateleftnew';
        var data5 = {file_name: this.statusvalue,folder_name : 'status_img',arg : type};



        this._http.post(link, data5)
            .subscribe(data11 => {
                this.filepath = data11.text();
                this.rotating = false;
            }, error => {
                console.log("Oooops!");
            });
    }

    openvideodiv(){
        this.statusText = '';
        this.statusText1 = '';
        this.statustype = '';
        this.statusvalue = '';
        this.tagpeople = '';
        this.videopath = '';
        this.filepath = '';
        this.imagepath = '';

        this.photoval = false;
        this.videoval = false;
        this.youtubeval = false;
        this.isVideo = true;
        this.isPhoto = false;
    }

    addVideo(){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Upload Video',
            cssClass : 'photoSheet',
            buttons: [
                {
                    text: 'Camera',
                    icon: 'videocam',
                    handler: () => {
                        this.opencameraforvideo();
                    }
                },{
                    text: 'Gallery',
                    icon: 'film',
                    handler: () => {
                        this.openvideobowse();
                    }
                }
            ]
        });
        actionSheet.present();
    }

    opencameraforvideo(){

        let options: CaptureVideoOptions = { limit: 1 };
        MediaCapture.captureVideo(options)
            .then(
                (data: MediaFile[]) => {

                    this.videopath = data[0]['fullPath'];
                    this.videoval = true;
                    this.isVideo = false;
                    this.isStatusInput = true;
                    this.statustype = 'mp4';





                },
                (err: CaptureError) => {
                    alert(err)



                }
            );
    }

    localvideoupload(){

        var msg = this.statusText;

        var link = 'http://torqkd.com/user/ajs2/storelocalfilepath';
        var data = {'msg':msg,'msg1':this.statusText1,'share_with':this.share_with,'group_id':0,'type':'video','value':'','is_status':1,tagpeople:this.tagpeople,'sess_user':this.loggedinuser,localfilepath:this.videopath};



        this._http.post(link, data)
            .subscribe(data2 => {

                $('#text-box').find('.highlightTextarea-highlighter').html('');
                $('.highlightTextarea').css('height',58);
                $('.highlightTextarea-container').css('height',58);
                $('.highlightTextarea-highlighter').css('height',58);
                this.isStatusInput = false;
                this.videoval = false;
                this.youtubeval = false;

                $('#statusuparea').text('');
                $( '#extracted_url' ).html('');


                this.status_id = data2.text();
                this.statustype = '';

                var status_id = data2.text();

                this.uploadvideo(status_id);

            }, error => {
                console.log("Oooops!");
            });
    }


    uploadvideo(status_id){

        var filebasename = this.videopath.split("/").pop();

        const fileTransfer = new Transfer();
        var options: any;

        options = {
            fileKey: 'file',
            //fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.demo866280/cache/',''),
            fileName: filebasename,
            //fileName: this.videopath.toString().replace('file:/storage/emulated/0/DCIM/Camera/',''),
            headers: {}

        }
        //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
        fileTransfer.upload(this.videopath, "http://166.62.34.31:2/uploads", options)
            .then((data) => {
                // success

                var data1:any = JSON.parse(data.response);


                if(data1.error_code == 0){
                    this.statusvalue = data1.filename;
                    var link = 'http://torqkd.com/user/ajs2/movevdofile';
                    var data5 = {file_name: data1.filename,folder_name : 'video/converted'};



                    this._http.post(link, data5)
                        .subscribe(data11 => {
                            console.log("Oooops!");
                        }, error => {
                            console.log("Oooops!");
                        });

                   // this.statusupdatevideo();

                    var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                    var data511 = {'value':data1.filename,'status_id':status_id};

                    this._http.post(link, data511)
                        .subscribe(data => {
                            this.statusdata.splice(0, 0,data.json());
                            //this.loadmaps(this.statusdata);
                            this.socialfeedoffset+=1;

                            $('#text-box').find('.highlightTextarea-highlighter').html('');
                            $('.highlightTextarea').css('height',58);
                            $('.highlightTextarea-container').css('height',58);
                            $('.highlightTextarea-highlighter').css('height',58);
                            this.isStatusInput = false;

                            $('#statusuparea').text('');
                            $( '#extracted_url' ).html('');

                            this.statusText = '';
                            this.statusText1 = '';
                            this.statustype = '';
                            this.statusvalue = '';
                            this.tagpeople = '';

                            this.filepath = '';
                            this.imagepath = '';
                            this.videopath = '';
                            this.isPhoto = false;
                            this.isVideo = false;
                            this.photoval = false;
                            this.videoval = false;
                            this.youtubeval = false;

                            this.status_id = 0;

                        }, error => {
                            console.log("Oooops!");
                        });


                }else{
                    alert('error occured');
                }



            }, (err) => {
                // error
                alert(JSON.stringify(err));
                //this.statuscancel();
            })
    }


    statusupdatevideo(){

        var msg = this.statusText;

        if(msg != '' || this.statusvalue !=''){

            this.local = new Storage(LocalStorage);

            this.local.get('tagpeoplelist').then((value) => {
                this.tagpeople = value;

                var msg1 = this.statusText1;
                var share_with = $('#share_with').val();
                var group_id = 0;


                var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                var data5 = {'msg':msg,'msg1':msg1,'share_with':this.share_with,'group_id':group_id,'type':this.statustype,'value':this.statusvalue,'is_status':1,tagpeople:this.tagpeople,'sess_user':this.loggedinuser,'status_id':this.status_id};

                this._http.post(link, data5)
                    .subscribe(data => {
                        this.statusdata.splice(0, 0,data.json());
                       // this.loadmaps(this.statusdata);
                        this.socialfeedoffset+=1;

                        $('#text-box').find('.highlightTextarea-highlighter').html('');
                        $('.highlightTextarea').css('height',58);
                        $('.highlightTextarea-container').css('height',58);
                        $('.highlightTextarea-highlighter').css('height',58);
                        this.isStatusInput = false;

                        $('#statusuparea').text('');
                        $( '#extracted_url' ).html('');

                        this.statusText = '';
                        this.statusText1 = '';
                        this.statustype = '';
                        this.statusvalue = '';
                        this.tagpeople = '';

                        this.filepath = '';
                        this.imagepath = '';
                        this.videopath = '';
                        this.isPhoto = false;
                        this.isVideo = false;
                        this.photoval = false;
                        this.videoval = false;
                        this.youtubeval = false;

                        this.status_id = 0;

                    }, error => {
                        console.log("Oooops!");
                    });
            });

            this.local = new Storage(LocalStorage);
            this.local.remove('tagpeoplelist');
        }else{
            alert("Please write status or upload video/imnage");
        }


    }

    openvideobowse(){
        var options = {
            quality: 50,
            //destinationType: Camera.FILE_URI,
            sourceType: 0,
            mediaType:1
        };

        Camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;

            this.videopath = imageData;
            this.videoval = true;
            this.isVideo = false;
            this.isStatusInput = true;
            this.statustype = 'mp41';



        }, (err) => {
            alert(JSON.stringify(err));
        });
    }

    localvideoupload1(){

        var msg = this.statusText;

        var link = 'http://torqkd.com/user/ajs2/storelocalfilepath';
        var data = {'msg':msg,'msg1':this.statusText1,'share_with':this.share_with,'group_id':0,'type':'video','value':'','is_status':1,tagpeople:this.tagpeople,'sess_user':this.loggedinuser,localfilepath:this.videopath};

        this._http.post(link, data)
            .subscribe(data2 => {

                $('#text-box').find('.highlightTextarea-highlighter').html('');
                $('.highlightTextarea').css('height',58);
                $('.highlightTextarea-container').css('height',58);
                $('.highlightTextarea-highlighter').css('height',58);
                this.isStatusInput = false;
                this.videoval = false;
                this.youtubeval = false;

                $('#statusuparea').text('');
                $( '#extracted_url' ).html('');


                this.status_id = data2.text();
                this.statustype = '';
                var status_id = data2.text();

                this.uploadvideo1(status_id);

            }, error => {
                console.log("Oooops!");
            });
    }

    uploadvideo1(status_id){

        const fileTransfer = new Transfer();
        var options: any;

        options = {
            fileKey: 'file',
            //fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.demo866280/cache/',''),
            fileName: this.videopath.toString().replace('/storage/emulated/0/DCIM/Camera/',''),
            headers: {}

        }
        //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
        fileTransfer.upload(this.videopath, "http://166.62.34.31:2/uploads", options)
            .then((data) => {
                // success

                var data1:any = JSON.parse(data.response);


                if(data1.error_code == 0){
                    this.statusvalue = data1.filename;
                    var link = 'http://torqkd.com/user/ajs2/movevdofile';
                    var data5 = {file_name: data1.filename, folder_name : 'video/converted'};

                    this._http.post(link, data5)
                        .subscribe(data11 => {
                            console.log("Oooops!");
                        }, error => {
                            console.log("Oooops!");
                        });

                   // this.statusupdatevideo();

                    var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                    var data511 = {'value':data1.filename,'status_id':status_id};

                    this._http.post(link, data511)
                        .subscribe(data => {
                            this.statusdata.splice(0, 0,data.json());
                            //this.loadmaps(this.statusdata);
                            this.socialfeedoffset+=1;

                            $('#text-box').find('.highlightTextarea-highlighter').html('');
                            $('.highlightTextarea').css('height',58);
                            $('.highlightTextarea-container').css('height',58);
                            $('.highlightTextarea-highlighter').css('height',58);
                            this.isStatusInput = false;

                            $('#statusuparea').text('');
                            $( '#extracted_url' ).html('');

                            this.statusText = '';
                            this.statusText1 = '';
                            this.statustype = '';
                            this.statusvalue = '';
                            this.tagpeople = '';

                            this.filepath = '';
                            this.imagepath = '';
                            this.videopath = '';
                            this.isPhoto = false;
                            this.isVideo = false;
                            this.photoval = false;
                            this.videoval = false;
                            this.youtubeval = false;

                            this.status_id = 0;

                        }, error => {
                            console.log("Oooops!");
                        });


                }else{
                    alert('error occured');
                }



            }, (err) => {
                // error
                alert(JSON.stringify(err));
                //this.statuscancel();
            })
    }

    getytsearchkey(namekey){
        this.ytsearchkey = namekey;
    }

    ytvideoseacrh(){

        if(this.ytsearchkey == ''){
            alert('Please enter search keyword');
        }else{

            let modal = this.modalCtrl.create(YtvdoListPage, { searchkey : this.ytsearchkey });

            modal.onDidDismiss(data => {
                this.isVideo = false;
                this.isStatusInput = true;
                this.youtubeval = true;
                this.statustype = 'video';
                this.statusvalue = data.videoid;
            });

            modal.present();

        }
    }


    opencamera5(){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Camera',
            cssClass : 'photoSheet',
            buttons: [
                {
                    text: 'Photo',
                    icon: 'camera',
                    handler: () => {
                        this.opencamera();
                    }
                },{
                    text: 'Video',
                    icon: 'videocam',
                    handler: () => {
                        this.opencameraforvideo();
                    }
                }
            ]
        });
        actionSheet.present();
    }

    dfsdfsd(){
        alert(1);
    }

    playStatusVdo(videoval,poster){
        let modal = this.modalCtrl.create(HomevideomodalPage,{"url": "http://torqkd.com/uploads/video/converted/"+videoval,"poster":poster});
        modal.present();
    }



    checkInternetclass(){
        if(this.isInternet == 0){
            return 'no-connectionheader';
        }

        return '';
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

    tableinsert(tbl){

        let data;


        if(tbl == 'profileStatdata'){
            data = JSON.stringify(this.statdata);
        }
        if(tbl == 'profileStatusdata'){
            data = JSON.stringify(this.statusdata);
        }
        if(tbl == 'profileBanner1data'){
            data = JSON.stringify(this.banner1data);
        }
        if(tbl == 'profileBanner2data'){
            data = JSON.stringify(this.banner2data);
        }



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

                if(data.rows.length){
                    let redata = data.rows.item(0).datacolum;

                    if(tbl == 'profileStatdata'){
                        this.statdata = JSON.parse(redata);
                    }
                    if(tbl == 'profileStatusdata'){
                        this.statusdata = JSON.parse(redata);
                    }
                    if(tbl == 'profileBanner1data'){
                        this.banner1data = JSON.parse(redata);
                    }
                    if(tbl == 'profileBanner2data'){
                        this.banner2data = JSON.parse(redata);
                    }
                }


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

    /*****************************For SQL Data[end]*******************************************/

}


