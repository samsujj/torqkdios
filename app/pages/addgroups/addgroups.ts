import { Component } from '@angular/core';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams,ActionSheetController,MenuController, ToastController} from "ionic-angular";
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {GroupdetailsPage} from "../groupdetails/groupdetails";
import {
  ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions, MediaCapture, ScreenOrientation,
  Transfer, Camera, StreamingMedia, StreamingVideoOptions, Network, SQLite
} from 'ionic-native';
import {HomePage} from '../home/home';
import {UpdateprofilePage} from '../updateprofile/updateprofile';

/*
  Generated class for the AddgroupsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/addgroups/addgroups.html',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class AddgroupsPage {
  public homepage = HomePage;
  public updateprofilepage = UpdateprofilePage;
  private addGroupForm:FormGroup;
  private userlist;
  private sportlist;
  private sel_users = [];
  private local:LocalStorage;
  private loggedinuser;
  private imagepath;
  private filepath;
  private imagename;
  private sportsid;

  private isInternet;
  public isOfflineData;


  constructor(public fb: FormBuilder,private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http,public actionSheetCtrl: ActionSheetController,public menu: MenuController,public platform:Platform,private toastCtrl: ToastController) {

    this.imagename = '';
    this.sportsid = 0;

    this.addGroupForm = fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      type: ["", Validators.required],
    });

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      this.loggedinuser=JSON.parse(value).id;
      this.userlistfu();
      if(value!=null) {
        console.log(1);
      }
      else{
        $('ion-content').removeClass('hide');
      }
    }).catch((err)=>{
      this.loggedinuser = 0;
      this.userlistfu();
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

    /****************Sport List********************/
    var link3 = 'http://torqkd.com/user/ajs2/allsports';
    var data3 = {};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          this.sportlist = res3.json();
        }, error => {
          console.log("Oooops!");
        });
    /****************Sport List********************/

  }

  userlistfu(){
    /****************User List********************/
    var link2 = 'http://torqkd.com/user/ajs2/alluserList';
    var data2 = {sess_id: this.loggedinuser};



    this._http.post(link2, data2)
        .subscribe(res2 => {
          this.userlist = res2.json();
        }, error => {
          console.log("Oooops!");
        });
    /****************User List********************/
  }

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

  handleChange(event,uid){
    if(event._checked){
      this.sel_users.push(uid);
    }else{
      var idx = this.sel_users.indexOf(uid);
      this.sel_users.splice(idx,1);
    }

    console.log(this.sel_users);
  }

  selectall(){
    for(let n in this.userlist){
      this.userlist[n].checkval=true;
    }
  }
  selectnone(){
    for(let n in this.userlist){
      this.userlist[n].checkval=false;
    }
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
            this.imagename = data1.filename;
            this.filepath = this.imagepath;
            var link = 'http://torqkd.com/user/ajs2/movegrfile';
            var data5 = {file_name: data1.filename};



            this._http.post(link, data5)
                .subscribe(data11 => {
                  //this.filepath = data11.text();
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
      fileName: this.imagepath.toString().replace('file:///data/data/com.ionicframework.torkq502502/cache/',''),
      headers: {}

    }
    //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
    fileTransfer.upload(this.imagepath, "http://166.62.34.31:2/uploads", options)
        .then((data) => {
          // success

          var data1:any = JSON.parse(data.response);



          if(data1.error_code == 0){
            this.imagename = data1.filename;
            this.filepath = this.imagepath;
            var link = 'http://torqkd.com/user/ajs2/movegrfile';
            var data5 = {file_name: data1.filename};



            this._http.post(link, data5)
                .subscribe(data11 => {
                //  this.filepath = data11.text();
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

  selsports(id){
    this.sportsid = id;
  }
  zxczx(id){
    return ( id == this.sportsid) ? 'activeimg' : '';
  }

  formsubmit(event) {
    let x: any;

    for (x in this.addGroupForm.controls) {
      this.addGroupForm.controls[x].markAsTouched();
    }

     if(this.imagename == ''){
       let toast = this.toastCtrl.create({
         message: 'Please Upload Image.',
         duration: 2000,
         position: 'middle',
         cssClass: 'addRoutesToast'
       });
       toast.present();
       return false;
    }

    if(this.sportsid == 0){
      let toast = this.toastCtrl.create({
        message: 'Please select sport.',
        duration: 2000,
        position: 'middle',
        cssClass: 'addRoutesToast'
      });
      toast.present();
      return false;
    }

    if (this.addGroupForm.valid) {

      var link = 'http://torqkd.com/user/ajs2/addGroup';
      var data = {name: event.name, description: event.description, type: event.type,sess_user:this.loggedinuser,userlist:this.sel_users,sports_id:this.sportsid,image:this.imagename};

      this._http.post(link, data)
          .subscribe(res => {

            var sdfs:string = res.text();
            if(sdfs == '0'){
              alert('Error ocurred');
            }else{
              this.navCtrl.push(GroupdetailsPage, {id: res.text()});
            }

          }, error => {
            console.log("Oooops!");
          });


    }
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
