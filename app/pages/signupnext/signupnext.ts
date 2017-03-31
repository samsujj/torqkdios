import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage, LocalStorage,ModalController,ToastController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {SignupconnectPage} from "../signupconnect/signupconnect";
import {SignupaddimagePage} from "../signupaddimage/signupaddimage";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {ControlGroup, Control} from "@angular/common";
import {Facebook,InAppBrowser} from 'ionic-native';

/*
  Generated class for the SignupnextPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/signupnext/signupnext.html',
})
export class SignupnextPage {
  private signUpForm:FormGroup;
  public homepage = HomePage;
  private social_type = '';
  private accessToken;

  constructor(private navCtrl: NavController,public modalCtrl: ModalController,public fb: FormBuilder,private _http: Http,public toastCtrl: ToastController) {
    this.signUpForm = fb.group({
      senderList: ["", Validators.required],
      mailBody: ["Be sure to check out torkq.com. Torkq brings the consciousness of outdoor sports to a new, progressive social media realm. Torkq is a collective of runners, jumpers, climbers, riders, hikers, surfers and all who dare to smack the terrain from land, sky, powder and H2O. Now go get it!! Time to connect, track and explore. I use Torkq to connect, track and explore my favorite sports.", Validators.required],
    });
  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  formsubmit(ev){
    let x: any;

    for (x in this.signUpForm.controls) {
      this.signUpForm.controls[x].markAsTouched();
    }
    if (this.signUpForm.valid) {

      var link = 'http://torqkd.com/user/ajs2/signup';
      var data = {mailBody : ev.mailBody,senderList : ev.senderList};

      this._http.post(link, data)
          .subscribe(res => {
            let toast = this.toastCtrl.create({
              message: 'Mail sent successfully.',
              duration: 3000,
              position : 'middle',
              cssClass : 'social-share-success'
            });

            toast.present();
          }, error => {
            console.log("Oooops!");
          });


    }
  }


  cngsocialselect(social_type){
    this.social_type = social_type;
  }

  social_share(){
    if(this.social_type == 'fb'){
      Facebook.login(["email","public_profile"]).then((result) => {

        if(result.status == 'connected'){
          this.accessToken = result.authResponse.accessToken;
            var obj = {
              method: 'feed',
              link: 'http://torkq.com'
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





        }else{
          alert('An Error occured in FB Login');
        }

      });
    }
    if(this.social_type == 'tw'){
      let browser = new InAppBrowser('http://torqkd.com/user/ajs2/twittershare1', '_blank');
    }
  }

  next_n(){
    this.navCtrl.push(SignupaddimagePage);
  }

}
