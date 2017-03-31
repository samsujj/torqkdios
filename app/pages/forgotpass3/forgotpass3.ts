import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage, LocalStorage,ModalController ,NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {SignupactivityPage} from "../signupactivity/signupactivity";
import {SignupconnectPage} from "../signupconnect/signupconnect";
import {SignupnextPage} from "../signupnext/signupnext";
import {SignupaddimagePage} from "../signupaddimage/signupaddimage";
import {LoginPage} from "../login/login";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {ControlGroup, Control} from "@angular/common";
/*
  Generated class for the SignupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/forgotpass3/forgotpass3.html',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class ForgotPass3Page {
  private forgotPassForm:FormGroup;
  public homepage = HomePage;
  public verifyemail=true;
  public emailmatch=true;
  public countrylist = [];
  public statelist = [];
  public stateLoad = false;
  private local:LocalStorage;
  private email;
  private id;

  constructor(private navCtrl: NavController,public modalCtrl: ModalController,public fb: FormBuilder,private _http: Http,private _navParams: NavParams) {

    this.email = this._navParams.get("email");
    this.id = this._navParams.get("id");

    this.forgotPassForm = fb.group({
      password: ["", Validators.required],
      password2: [""]
    }, {validator: this.matchingPasswords('password', 'password2')});


  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }

  formsubmit(event){

    let x: any;

    for (x in this.forgotPassForm.controls) {
      this.forgotPassForm.controls[x].markAsTouched();
    }


    if (this.forgotPassForm.valid) {

      var link = 'http://torqkd.com/user/ajs2/Change_password';
      var data = {id : this.id, email: this.email, password : event.password};

      this._http.post(link, data)
          .subscribe(res => {

            this.navCtrl.push(LoginPage);

          }, error => {
            console.log("Oooops!");
          });


    }

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


}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //console.log('vali email called');
  return re.test(email);
}
