import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage, LocalStorage,ModalController,ToastController,ActionSheetController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {SignupconnectPage} from "../signupconnect/signupconnect";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {ControlGroup, Control} from "@angular/common";

import {ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions,MediaCapture,ScreenOrientation, Transfer,Camera,StreamingMedia, StreamingVideoOptions} from 'ionic-native';
import {ProfilePage} from '../profile/profile';
import {ImageCropPage} from "../imagecrop/imagecrop";
import {ImageCrop1Page} from "../imagecrop1/imagecrop1";


/*
  Generated class for the SignupaddimagePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/signupaddimage/signupaddimage.html',
})
export class SignupaddimagePage {
  public homepage = HomePage;
  private local:LocalStorage;
  private userid;
  private cdatetime;
  public userimage;
  public userbackimage;
  public imagepath;
  public filepath;
  public filepath1;
  public isupload;
  public isupload1;

  constructor(private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http,public actionSheetCtrl: ActionSheetController) {

    this.cdatetime = (new Date).getTime();
    this.userimage = 'default.jpg';
    this.userbackimage = 'default.jpg';
   // this.filepath = 'http://torqkd.com/uploads/user_image/thumb/default.jpg';
    //this.filepath1 = 'http://torqkd.com/uploads/user_image/background/thumb/default.jpg';

    //  this.isupload = 0;
    //  this.isupload1 = 0;

    this.local = new Storage(LocalStorage);

      this.userid = 498;

      this.getprofileimage(1);
      this.getprofileimage(2);

    this.local.get('newUserId').then((value) => {
      if(value!=null) {
        this.userid = value;
        this.getprofileimage(1);
          this.getprofileimage(2);
      }else{
        this.navCtrl.push(HomePage);
      }
    }).catch((err)=>{
      this.navCtrl.push(HomePage);
    });
  }

  getprofileimage(type){
      var link3 = 'http://torqkd.com/user/ajs2/getUserfile2';
      var data3 = {type:type,userid : this.userid};



      this._http.post(link3, data3)
          .subscribe(res3 => {
              var jsonres = res3.json();

              if(jsonres.image_name == 'default.jpg' || jsonres.image_name == 'default_f.jpg'){
                  if(type == 1){
                      this.filepath = 'http://torqkd.com/uploads/user_image/thumb/default.jpg';
                      this.isupload = 0;
                  }
                  if(type == 2){
                      this.filepath1 = 'http://torqkd.com/uploads/user_image/background/thumb/default.jpg';
                      this.isupload1 = 0;
                  }
              }else{
                  if(type == 1){
                      this.filepath = jsonres.image_path;
                      this.isupload = 1;
                  }
                  if(type == 2){
                      this.filepath1 = jsonres.image_path;
                      this.isupload1 = 1;
                  }
              }
              // this.fileDownload();
          }, error => {
              console.log("Oooops!");
          });
  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  addPhoto(type){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Image',
      cssClass : 'photoSheet',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.opencamera(type);
          }
        },{
          text: 'Gallery',
          icon: 'photos',
          handler: () => {
            this.openphotobowse(type);
          }
        }
      ]
    });
    actionSheet.present();
  }

  opencamera(type){
    let options: CaptureImageOptions = { limit: 1 };
    MediaCapture.captureImage(options)
        .then(
            (data: MediaFile[]) => {
              this.imagepath=data[0]['fullPath'];
              if(type ==1)
                this.filepath= 'images/fileloader.gif';
              if(type ==2)
                this.filepath1= 'images/fileloader.gif';
              this.uploadpic2(type);
            },
            (err: CaptureError) => {
            }
        );
  }

  uploadpic2(type){


    const fileTransfer = new Transfer();
    var options: any;

    options = {
      fileKey: 'file',
      fileName: this.imagepath.toString().replace('file:/storage/emulated/0/Pictures/',''),
      headers: {}

    }
    //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
    fileTransfer.upload(this.imagepath, "http://166.62.34.31:2/uploads", options)
        .then((data) => {
          // success

          var data1:any = JSON.parse(data.response);



          if(data1.error_code == 0){
            if(type == 1)
              var link = 'http://torqkd.com/user/ajs2/moveprofileimage';
            if(type == 2)
              var link = 'http://torqkd.com/user/ajs2/moveprofilebackimage';
            var data5 = {file_name: data1.filename,userid:this.userid};



            this._http.post(link, data5)
                .subscribe(data11 => {
                  if(type == 1){
                      this.filepath = data11.text();
                      this.isupload = 1;
                      this.navCtrl.push(ImageCropPage,{userid:this.userid,'page':'signup'});
                  }
                  if(type == 2){
                      this.filepath1 = data11.text();
                      this.isupload1 = 1;
                      this.navCtrl.push(ImageCrop1Page,{userid:this.userid,'page':'signup'});
                  }
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
  openphotobowse(type){
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
        if(type ==1)
          this.filepath= 'images/fileloader.gif';
        if(type ==2)
          this.filepath1= 'images/fileloader.gif';

        this.uploadpic(type);
      }
    }, (err) => {

      alert(err);

    });
  }

  uploadpic(type){


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
            if(type == 1)
              var link = 'http://torqkd.com/user/ajs2/moveprofileimage';
            if(type == 2)
              var link = 'http://torqkd.com/user/ajs2/moveprofilebackimage';
            var data5 = {file_name: data1.filename,userid:this.userid};



            this._http.post(link, data5)
                .subscribe(data11 => {
                  if(type == 1){
                      this.filepath = data11.text();
                      this.isupload = 1;
                      this.navCtrl.push(ImageCropPage,{userid:this.userid,'page':'signup'});
                  }
                  if(type == 2){
                      this.filepath1 = data11.text();
                      this.isupload1 = 1;
                      this.navCtrl.push(ImageCrop1Page,{userid:this.userid,'page':'signup'});
                  }
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

    signUpfinish(){
      var link3 = 'http://torqkd.com/user/ajs2/login2';
      var data3 = {userid:this.userid};



      this._http.post(link3, data3)
          .subscribe(res3 => {
            this.local = new Storage(LocalStorage);
            this.local.remove('newUserId');

            this.local.set('userinfo', JSON.stringify(res3.json()));
            this.navCtrl.push(ProfilePage);
          }, error => {
            console.log("Oooops!");
          });
    }


    imagedel(type){
        var link = 'http://torqkd.com/user/ajs2/profileImgDel';
        var data5 = {type: type,userid:this.userid};



        this._http.post(link, data5)
            .subscribe(data11 => {
                var res = data11.json();
                if(type == 1){
                    this.filepath = 'http://torqkd.com/uploads/user_image/thumb/default.jpg';
                    this.isupload = 0;
                }
                if(type == 2){
                    this.filepath1 = 'http://torqkd.com/uploads/user_image/background/thumb/default.jpg';
                    this.isupload1 = 0;
                }
            }, error => {
                console.log("Oooops!");
            });
    }

    cropnow(){
        this.navCtrl.push(ImageCropPage,{userid:this.userid,'page':'signup'});
    }
    cropnow1(){
        this.navCtrl.push(ImageCrop1Page,{userid:this.userid,'page':'signup'});
    }



}
