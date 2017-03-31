import {Component, ViewChild} from "@angular/core";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Splashscreen, InAppBrowser, ImagePicker, Network, SQLite} from "ionic-native";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,MenuController} from "ionic-angular";
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

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/profileeventlist/profileeventlist.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class profileeventlistPage {
    public homepage = HomePage;
    public updateprofilepage = UpdateprofilePage;
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


    public statusText = '';
    public statusText1 = '';
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
    private isInternet;
    public isOfflineData;


    constructor(fb: FormBuilder,public platform: Platform,public navCtrl: NavController,private _http: Http ,public modalCtrl: ModalController ,sanitizer:DomSanitizationService ,public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public menu: MenuController) {
        this.sanitizer=sanitizer;
        this.loginForm = fb.group({
            email: ["", Validators.required],
            password: ["", Validators.required]
        });

        this.eventoffset = 0;
        this.eventdata = [];


        platform.registerBackButtonAction(() => {

            this.navCtrl.pop();

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




        this.local = new Storage(LocalStorage);

        this.local.get('userinfo').then((value) => {
            this.loggedinuser=JSON.parse(value).id;
            console.log(JSON.parse(value).id);
            if(value!=null) {

                this.isloggedin=true;

                this.eventoffset = 0;

                this.getStatData();
                this.getBannerData();
                this.getEvents();

            }
            else{
                $('ion-content').removeClass('hide');
                this.isloggedin=false;
            }
        });

        this.local = new Storage(LocalStorage);

        this.local.get('userinfo').then((value) => {

            if(value!=null) {

                this.isloggedin=true;
                $('.has-header').removeClass('hide');

            }
            else{

                this.isloggedin=false;
            }
        });
    }


    getStatData(){

        this.getFromdb('profileStatdata');

        if(this.isInternet == 1){

            /************statdata[start]*********************/
            var link1 = 'http://torqkd.com/user/ajs2/getonlystat/userid/'+this.loggedinuser;
            var data1 = {};

            this._http.post(link1, data1)
                .subscribe(data => {
                    if(data.json()==null){

                        return;
                    }
                    else{
                        this.statdata=data.json().statdet;
                        this.opendatase('profileStatdata');
                    }
                }, error => {
                    console.log("Oooops!");
                });
            /************statdata[end]*********************/

        }
    }

    getBannerData(){

        this.getFromdb('profileBanner1data');
        this.getFromdb('profileBanner2data');

        if(this.isInternet == 1){

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

                    }
                }, error => {
                    console.log("Oooops!");
                });
        }
    }


    getEvents(){

        this.getFromdb('profileEventdata');

        if(this.isInternet == 1){

            var link = 'http://torqkd.com/user/ajs2/getEvents';
            var data = {offset: this.eventoffset,sess_user:this.loggedinuser,userid:this.loggedinuser};


            this._http.post(link, data)
                .subscribe(res => {
                    var res2 = res.json();
                    this.eventlist = res2.event;
                    this.totalevent = res2.totalCount;
                    this.eventcount = this.eventlist.length;
                    this.eventoffset = parseInt(this.eventoffset)+5;

                    this.opendatase('profileEventdata');

                }, error => {
                    console.log("Oooops!");
                });

        }
    }




    getMoreEvents(){
        var link = 'http://torqkd.com/user/ajs2/getEvents';
        var data = {offset: this.eventoffset,sess_user:this.loggedinuser,userid:this.loggedinuser};


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
        let browser = new InAppBrowser(url, '_system');
    }

    openmenu(){
        //$('.navmenul').click();
        this.menu.toggle();
    }


    onPageScroll(event) {
        if($('ion-header').height() < event.target.scrollTop) {


        }

    }

    ngAfterViewInit() {
        this.content.addScrollListener(this.onPageScroll);
    }




    makeGetRequest() {
        this._http.get("https://httpbin.org/ip")
            .subscribe(data => {
                console.log(data.json());
                // /alert(data.json());
                //this.nav.present(alert);
            }, error => {
                console.log(JSON.stringify(error.json()));
            });
    }

    openphotobowse(){

        $('.status-input').removeClass('hide');
        $('.browsephoto').removeClass('hide');

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
            console.log(extracted_url);
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

    statusupdate(){
        var msg = $('#statusuparea').text();

        alert(msg);

        if(msg != '' || this.statusvalue !=''){

            this.local = new Storage(LocalStorage);

            this.local.get('tagpeoplelist').then((value) => {
                this.tagpeople = value;

                var msg1 = this.statusText1;
                var share_with = $('#share_with').val();
                var group_id = 0;


                var headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var link = 'http://torqkd.com/user/ajs2/statusUpdate';
                var data = {'msg':msg,'msg1':msg1,'share_with':$('#share_with').val(),'group_id':group_id,'type':this.statustype,'value':this.statusvalue,'is_status':1,'status_id':0,tagpeople:this.tagpeople,'sess_user':this.loggedinuser};

                this._http.post(link, data)
                    .subscribe(data => {
                        this.statusdata.splice(0, 0,data.json());

                        $('#text-box').find('.highlightTextarea-highlighter').html('');
                        $('.highlightTextarea').css('height',58);
                        $('.highlightTextarea-container').css('height',58);
                        $('.highlightTextarea-highlighter').css('height',58);
                        this.isStatusInput = false;

                        $('#statusuparea').text('');
                        $( '#extracted_url' ).html('');

                        this.statusText1 = '';
                        this.statustype = '';
                        this.statusvalue = '';
                        this.tagpeople = '';



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

    showtermsploicy1(type){
        let modal = this.modalCtrl.create(CommonPopupPage, {
            "type": type
        });

        modal.present();

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


        if(tbl == 'profileEventdata'){
            data = JSON.stringify(this.eventlist);
        }
        if(tbl == 'profileStatdata'){
            data = JSON.stringify(this.statdata);
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
            db.executeSql("INSERT INTO "+tbl+" (datacolum) VALUES ($1)", [data]).then(() => {
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

                    if(tbl == 'profileEventdata'){
                        this.eventlist = JSON.parse(redata);
                    }
                    if(tbl == 'profileStatdata'){
                        this.statdata = JSON.parse(redata);
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



