import {Component, ElementRef, ViewChild} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {HomePage} from '../home/home';
import * as $ from "jquery";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {UserblockPage} from "../userblock/userblock";
import {ProfilePage} from "../profile/profile";
import {ImageCropPage} from "../imagecrop/imagecrop";
import {ImageCrop1Page} from "../imagecrop1/imagecrop1";
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,ActionSheetController,MenuController, ToastController} from "ionic-angular";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {ControlGroup, Control} from "@angular/common";
import {
    ImagePicker, CaptureImageOptions, MediaFile, CaptureError, CaptureVideoOptions, MediaCapture, ScreenOrientation,
    Transfer, Camera, StreamingMedia, StreamingVideoOptions, Crop, SQLite, Network
} from 'ionic-native';


import Cropper from 'cropperjs';
/*
  Generated class for the UpdateprofilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/updateprofile/updateprofile.html',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class UpdateprofilePage {
    @ViewChild('imageSrc') input: ElementRef;

    private cropper:cropperjs.Cropper;


    public homepage = HomePage;
    public profilepage = ProfilePage;
    public sportlist;
    private signUpForm:FormGroup;
    private loggedinuser;
    private local:LocalStorage;
    public countrylist = [];
    public statelist = [];
    public selsports = [];
    public stateLoad = false;
    private privacy;
    public imagepath;
    public filepath;
    public filepath1;
    public profimg_name;
    public backimg_name;
    public filepathorig;
    public filepath1orig;
    public cropimagepath;

    private isInternet;
    public isOfflineData;

  constructor(private navCtrl: NavController,public modalCtrl: ModalController,private _http: Http,public fb: FormBuilder,public actionSheetCtrl: ActionSheetController,public menu: MenuController,public platform: Platform ,private toastCtrl: ToastController) {





    this.signUpForm = fb.group({
      id: [""],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      email: ["", Validators.required],
      email2: [""],
      password: [""],
      password2: [""],
      location: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      state: ["", Validators.required]
    }, {validator: this.matchingPasswords('password', 'password2')});


    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
        this.getuserdetails();
      }else{
        this.navCtrl.push(HomePage);
      }
    }).catch((err)=>{
      this.navCtrl.push(HomePage);
    });


    /****************country list********************/
    var link3 = 'http://torqkd.com/user/ajs2/getCountryList';
    var data3 = {};



    this._http.post(link3, data3)
        .subscribe(res3 => {
          this.countrylist = res3.json();
        }, error => {
          console.log("Oooops!");
        });
    /****************country List********************/



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

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  public matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: ControlGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  changecountry(countryval){
    this.statelist = [];

    if(countryval != ''){
      this.stateLoad = true;
      var link3 = 'http://torqkd.com/user/ajs2/getStateList';
      var data3 = {id:countryval};



      this._http.post(link3, data3)
          .subscribe(res3 => {
            this.statelist = res3.json();
            this.stateLoad = false;
          }, error => {
            console.log("Oooops!");
            this.stateLoad = false;
          });
    }

  }


  getuserdetails(){
    var link3 = 'http://torqkd.com/user/ajs2/getUserDetails5';
    var data3 = {userid : this.loggedinuser };



    this._http.post(link3, data3)
        .subscribe(res3 => {
          var userdetails = res3.json();

          (<FormControl>this.signUpForm.controls['id']).updateValue(userdetails.id);
          (<FormControl>this.signUpForm.controls['fname']).updateValue(userdetails.fname);
          (<FormControl>this.signUpForm.controls['lname']).updateValue(userdetails.lname);
          (<FormControl>this.signUpForm.controls['email']).updateValue(userdetails.email);
          (<FormControl>this.signUpForm.controls['location']).updateValue(userdetails.location);
          (<FormControl>this.signUpForm.controls['city']).updateValue(userdetails.city);
          (<FormControl>this.signUpForm.controls['country']).updateValue(userdetails.country);
          (<FormControl>this.signUpForm.controls['state']).updateValue(userdetails.state);

          this.selsports = userdetails.user_sports;
            this.privacy = userdetails.privacy;

            this.filepath = userdetails.profileImg;
            this.filepath1 = userdetails.backImg;

            this.profimg_name = userdetails.profileImgName;
            this.backimg_name = userdetails.backImgName;

            this.filepathorig = userdetails.profileOrigImg;
            this.filepath1orig = userdetails.OrigbackImg;


          this.changecountry(userdetails.country);

        }, error => {
          console.log("Oooops!");
        });
  }


  formsubmit(event) {

    let x: any;

    for (x in this.signUpForm.controls) {
      this.signUpForm.controls[x].markAsTouched();
    }

    if (this.signUpForm.valid) {

      var link = 'http://torqkd.com/user/ajs2/updateProfile';
      var data = {
        id: event.id,
        fname: event.fname,
        lname: event.lname,
        location: event.location,
        city: event.city,
        country: event.country,
        state: event.state
      };

      this._http.post(link, data)
          .subscribe(res => {

            var sdfs: string = res.text();
            if (sdfs == 'error') {
              alert('Error ocurred');
            } else {

              this.navCtrl.push(ProfilePage);
            }

          }, error => {
            console.log("Oooops!");
          });


    }
  }


  selsportscls(id){
    var idx = this.selsports.indexOf(id);
    return ( idx > -1) ? 'activeimg' : '';
  }

    selsportsfunct(id){
        var idx = this.selsports.indexOf(id);

        if(idx == -1){
            this.selsports.push(id);
        }else{
            this.selsports.splice(idx,1);
        }

        var link = 'http://torqkd.com/user/ajs2/addDelsports';
        var data = { sportid: id, userid: this.loggedinuser };

        this._http.post(link, data)
            .subscribe(res => {

            }, error => {
                console.log("Oooops!");
            });


    }

    goblockpage(){
        /*let modal = this.modalCtrl.create(UserblockPage, {
        });

        modal.present();*/

        this.navCtrl.push(UserblockPage, {});
    }

    changeprivacy(){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'PRIVACY',
            cssClass : 'sharewithactionsheet',
            buttons: [
                {
                    text: 'public',
                    cssClass : (this.privacy == 1)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(1);
                    }
                },{
                    text: 'Friends',
                    cssClass : (this.privacy == 2)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(2);
                    }
                },{
                    text: 'Friends of Friends',
                    cssClass : (this.privacy == 3)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(3);
                    }
                },{
                    text: 'private me only',
                    cssClass : (this.privacy == 4)?'activebtn':'',
                    handler: () => {
                        this.changesharewithfun(4);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    changesharewithfun(pval){
        var link = 'http://torqkd.com/user/ajs2/updateuserprivacy';
        var data = { privacy : pval , user_id:this.loggedinuser};

        this._http.post(link, data)
            .subscribe(res => {
                this.privacy = pval;
            }, error => {
                console.log("Oooops!");
            });
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
                    var link;

                    if(type == 1)
                         link = 'http://torqkd.com/user/ajs2/moveprofileimage';
                    if(type == 2)
                         link = 'http://torqkd.com/user/ajs2/moveprofilebackimage';
                    var data5 = {file_name: data1.filename,userid:this.loggedinuser};



                    this._http.post(link, data5)
                        .subscribe(data11 => {
                            if(type == 1){
                                var data55 = data11.json();

                                this.profimg_name = data55.profileImgName;
                                this.filepath = data55.profileImg;
                                this.filepathorig = data55.profileOrigImgName;

                                this.navCtrl.push(ImageCropPage,{userid:this.loggedinuser});
                            }
                            if(type == 2){
                                this.backimg_name = this.loggedinuser+'.jpg';
                                this.filepath1 = data11.text();

                                this.navCtrl.push(ImageCrop1Page,{userid:this.loggedinuser});
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
            quality: 90,
            targetWidth: 300,
            targetHeight: 150,
            allowEdit:true,
            correctOrientation: false
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
            fileName: this.imagepath.toString().replace('file:///data/data/com.gratitube/cache/',''),
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
                    var data5 = {file_name: data1.filename,userid:this.loggedinuser};



                    this._http.post(link, data5)
                        .subscribe(data11 => {
                            if(type == 1){

                                var data55 = data11.json();

                                this.profimg_name = data55.profileImgName;
                                this.filepath = data55.profileImg;
                                this.filepathorig = data55.profileOrigImgName;


                                this.navCtrl.push(ImageCropPage,{userid:this.loggedinuser});
                            }
                            if(type == 2){
                                this.backimg_name = this.loggedinuser+'.jpg';
                                this.filepath1 = data11.text();

                                this.navCtrl.push(ImageCrop1Page,{userid:this.loggedinuser});
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

    imagedel(type){
        var link = 'http://torqkd.com/user/ajs2/profileImgDel';
        var data5 = {type: type,userid:this.loggedinuser};



        this._http.post(link, data5)
            .subscribe(data11 => {
                var res = data11.json();
                if(type == 1){
                    this.profimg_name = res.imgName;
                    this.filepath = res.imgSrc;
                }
                if(type == 2){
                    this.backimg_name = res.imgName;
                    this.filepath1 = res.imgSrc;
                }
            }, error => {
                console.log("Oooops!");
            });
    }


    opencrop(type){
        const fileTransfer = new Transfer();

        var options: any;

        options = {
            headers: {}

        }

        var fname = getfilename(this.filepathorig);



        fileTransfer.download(this.filepathorig, "file:///data/data/com.gratitube/cache/"+fname,true, options)
            .then((data) => {
                // success

                this.imagepath = data.nativeURL;

                Crop.crop(this.imagepath, {quality: 95})
                    .then(

                        newImage => {
                            this.cropimagepath=newImage;
                            this.filepath= 'images/fileloader.gif';
                            this.uploadpiccrop();
                            console.log("new image path is: " + newImage);

                        },
                        error => {
                            console.error("Error cropping image", error)
                        }
                    );


            }, (err) => {
                // error
                alert(JSON.stringify(err));
            })

    }

    uploadpiccrop(){

        const fileTransfer = new Transfer();
        var options: any;

        options = {
            fileKey: 'file',
            fileName: getfilename(this.cropimagepath),
            headers: {}

        }
        //fileTransfer.upload(this.imagepath, "http://torqkd.com/user/ajs2/testfileupload", options)
        fileTransfer.upload(this.cropimagepath, "http://166.62.34.31:2/uploads", options)
            .then((data) => {
                // success

                var data1:any = JSON.parse(data.response);



                if(data1.error_code == 0){
                    var link = 'http://torqkd.com/user/ajs2/movecropprofileimage';
                    var data5 = {file_name: data1.filename,userid:this.loggedinuser};



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
/*
    imageLoaded() {
        this.cropper = <cropperjs.Cropper>new Cropper(this.input.nativeElement, {
            aspectRatio: 142/156,
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
    cropnow(){

       // var cropdata = this.cropper.getCropBoxData();

        //console.log(this.cropper.getCropBoxData());
        //console.log(cropdata.height);

        console.log(this.cropper.getData());

    }
*/
    cropnow(){
        this.navCtrl.push(ImageCropPage,{userid:this.loggedinuser,'page':'profile'});
    }
    cropnow1(){
        this.navCtrl.push(ImageCrop1Page,{userid:this.loggedinuser,'page':'profile'});
    }

    showhelptext(type){
        if(type == 1){
            let toast = this.toastCtrl.create({
                message: 'Please Upload An Image Bigger Than 142X156 For Best Effects',
                duration: 4000,
                position: 'middle',
                cssClass: 'addRoutesToast'
            });
            toast.present();
        }
        if(type == 2){
            let toast = this.toastCtrl.create({
                message: 'Please Upload An Image Bigger Than 1156X576 For Best Effects',
                duration: 4000,
                position: 'middle',
                cssClass: 'addRoutesToast'
            });
            toast.present();
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


function getfilename(path){
    path = path.substring(path.lastIndexOf("/")+ 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}

