import { Component } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,ActionSheetController,MenuController} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import {DomSanitizationService} from "@angular/platform-browser";
import {PhotodetPage} from "../photodet/photodet";
import {AlbumvideoPage} from "../albumvideo/albumvideo";
import {ProfilePage} from "../profile/profile";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';
import {
  ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions, MediaCapture, ScreenOrientation,
  Transfer, Camera, StreamingMedia, StreamingVideoOptions, SQLite, Network
} from 'ionic-native';

/*
  Generated class for the AlbumPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/album/album.html',
})
export class AlbumPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private loggedinuser;
  private local:LocalStorage;
  private photolist;
  public albumvideopage = AlbumvideoPage;
  public profilepage = ProfilePage;
  public userImage;

  public isStatusInput = false;
  public statusText = '';
  public share_with = 1;
  public filepath;
  public imagepath;
  public statusvalue;

  private isInternet;
  public isOfflineData;

  public offset;
  public showviewmore;


  constructor(private navCtrl: NavController,private _http: Http, private sanitizer:DomSanitizationService,public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController,public menu: MenuController,public platform: Platform) {

    this.offset = 0;
    this.showviewmore = 1;

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;
      console.log(JSON.parse(value));
      if(value!=null) {
        this.getimages();
        this.userImage = JSON.parse(value).user_image;
      }
      else{
        $('ion-content').removeClass('hide');
        //this.getimages(0,60);
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
  getimages(){
    var link = 'http://torqkd.com/user/ajs2/getImagenew';
    var data = {userid:this.loggedinuser,sess_id : this.loggedinuser,offset:this.offset};



    this._http.post(link, data)
        .subscribe(res => {

          var resdata = res.json();

          if(this.offset > 0){
            this.photolist=this.photolist.concat(resdata);
          }else{
            this.photolist = resdata;
          }

          this.offset = this.offset + 10;



          if(resdata.length == 0){
            this.showviewmore = 0;
          }

        }, error => {
          console.log("Oooops!");
        });

  }

  getsanitizerstyle(imgsrc){
    return this.sanitizer.bypassSecurityTrustStyle('url(http://torqkd.com/user/ajs1/createimage?image=' + imgsrc + ')');
  }

  showPhotoDetails(item){
    /*let modal = this.modalCtrl.create(PhotodetPage, {
      "item": item,
    });

    modal.present();*/
    this.navCtrl.push(PhotodetPage, { "item": item });
  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
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

  changestatustext(keyval){
    this.statusText = keyval;
  }

  changesharewith(ev){
    this.share_with = ev;
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
              this.imagepath=data[0]['fullPath'];
              this.filepath= 'images/fileloader.gif';
              this.isStatusInput = true;
              this.uploadpic2();
            },
            (err: CaptureError) => {
            }
        );
  }

  uploadpic2(){

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
            var data5 = {file_name: data1.filename,folder_name : 'community_image'};



            this._http.post(link, data5)
                .subscribe(data11 => {
                  this.filepath = data11.text();
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
        this.filepath= 'images/fileloader.gif';
        this.isStatusInput = true;

        this.uploadpic();
      }
    }, (err) => {

      alert(err);

    });
  }

  uploadpic(){


    const fileTransfer = new Transfer();
    var options: any;

    options = {
      fileKey: 'file',
      //fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.demo866280/cache/',''),
      fileName: this.imagepath.toString().replace('file:///data/data/com.gratitube/cache/',''),
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
            var data5 = {file_name: data1.filename,folder_name : 'community_image'};



            this._http.post(link, data5)
                .subscribe(data11 => {
                  this.filepath = data11.text();
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
    var link = 'http://torqkd.com/user/ajs2/rotateleftnew';
    var data5 = {file_name: this.statusvalue,folder_name : 'community_image',arg : type};



    this._http.post(link, data5)
        .subscribe(data11 => {
          this.filepath = data11.text();
        }, error => {
          console.log("Oooops!");
        });
  }

  postcancel(){
    this.isStatusInput = false;
    this. statusText = '';
    this.share_with = 1;
    this.filepath='';
    this.imagepath='';
    this.statusvalue='';
  }

  postStatus(){
    var link = 'http://torqkd.com/user/ajs2/addAlbum';
    var data = {'value':this.statusvalue,'user_id':this.loggedinuser,'share_with':this.share_with,'type':'image','msg':this.statusvalue};

    this._http.post(link, data)
        .subscribe(data => {
          this.photolist.splice(0, 0,data.json());

          this.isStatusInput = false;
          this. statusText = '';
          this.share_with = 1;
          this.filepath='';
          this.imagepath='';
          this.statusvalue='';

        }, error => {
          console.log("Oooops!");
        });
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
