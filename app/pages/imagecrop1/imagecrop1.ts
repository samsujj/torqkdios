import {Component, ElementRef, ViewChild} from '@angular/core';
import {Http, Headers} from "@angular/http";
import { NavController,NavParams,Platform } from 'ionic-angular';
import Cropper from 'cropperjs';
import { Transfer } from 'ionic-native';
import {UpdateprofilePage} from "../updateprofile/updateprofile";
import {SignupaddimagePage} from "../signupaddimage/signupaddimage";

/*
  Generated class for the HomevideomodalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/imagecrop1/imagecrop1.html',
})
export class ImageCrop1Page {
  public userid;
  public fileurl;
  public filepath;
  public filename;
  public page;

  @ViewChild('imageSrc') input: ElementRef;

  private cropper:cropperjs.Cropper;

  constructor(private navCtrl: NavController,private _navParams: NavParams,public platform: Platform,private _http: Http) {
    this.userid=this._navParams.get("userid");
    this.page=this._navParams.get("page");


    var link3 = 'http://torqkd.com/user/ajs2/getUserfile';
    var data3 = {type:2,userid : this.userid};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          var jsonres = res3.json();

          this.filepath = jsonres.image_path;
          this.filename = jsonres.image_name;
         // this.fileDownload();
        }, error => {
          console.log("Oooops!");
        });

  }

  goback(){
    this.navCtrl.pop();
  }

  fileDownload(){
    const fileTransfer = new Transfer();

    var options: any;

    options = {
      headers: {}

    }

    var fname = getfilename(this.fileurl);



    fileTransfer.download(this.fileurl, "file:///data/data/com.gratitube/cache/"+fname,true, options)
        .then((data) => {
          // success

          this.filepath = data.nativeURL;




        }, (err) => {
          // error
          alert(JSON.stringify(err));
        })
  }

  imageLoaded() {
    this.cropper = <cropperjs.Cropper>new Cropper(this.input.nativeElement, {
      aspectRatio: 1174/ 535,
      dragMode: 'crop',
      modal: true,
      guides: true,
      highlight: false,
      background: true,
      autoCrop: true,
      autoCropArea: 0.9,
      responsive: true,
      crop: (e: cropperjs.CropperCustomEvent) => {

      }
    });
  }

  savecrop(){
    //var cropdata = this.cropper.getCropBoxData();
    var cropdata = this.cropper.getData();

    var height = cropdata.height;
    var width = cropdata.width;
    var left = cropdata.x;
    var top = cropdata.y;
    var rotate = cropdata.rotate;


    var link3 = 'http://torqkd.com/user/ajs2/cropimagesave22';
    var data3 = {height:height,width:width,left:left,top:top,rotate:rotate,imagename : this.filename};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          if(this.page == 'signup'){
            this.navCtrl.push(SignupaddimagePage);
          }else{
            this.navCtrl.push(UpdateprofilePage);
          }
        }, error => {
          console.log("Oooops!");
        });

  }

  rotateLeft(){
    this.cropper.rotate(-90);
  }

  rotateRight(){
    this.cropper.rotate(90);
  }



}

function getfilename(path){
  path = path.substring(path.lastIndexOf("/")+ 1);
  return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}