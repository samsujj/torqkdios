import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage, LocalStorage,ModalController,NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import {CommonPopupPage} from "../commonpopup/commonpopup";
import {SignupactivityPage} from "../signupactivity/signupactivity";
import {SignupconnectPage} from "../signupconnect/signupconnect";
import {SignupnextPage} from "../signupnext/signupnext";
import {SignupaddimagePage} from "../signupaddimage/signupaddimage";
import {ForgotPass3Page} from "../forgotpass3/forgotpass3";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import {Http, Headers} from "@angular/http";
import {ControlGroup, Control} from "@angular/common";
/*
  Generated class for the SignupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/forgotpass2/forgotpass2.html',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class ForgotPass2Page {
  private forgotPassForm:FormGroup;
  public homepage = HomePage;
  public verifyemail=true;
  public emailexist=false;
  public emailmatch=true;
  public countrylist = [];
  public statelist = [];
  public stateLoad = false;
  private local:LocalStorage;
  private email;

  constructor(private navCtrl: NavController,public modalCtrl: ModalController,public fb: FormBuilder,private _http: Http,private _navParams: NavParams) {
    this.email = this._navParams.get("email");

    this.forgotPassForm = fb.group({
      email: ["", Validators.required],
    });

  }

  showtermsploicy(type){
    let modal = this.modalCtrl.create(CommonPopupPage, {
      "type": type
    });

    modal.present();
  }


  formsubmit(event){

    this.emailexist = false;

    let x: any;

    for (x in this.forgotPassForm.controls) {
      this.forgotPassForm.controls[x].markAsTouched();
    }



    if (this.forgotPassForm.valid) {


      var link = 'http://torqkd.com/user/ajs2/forgot_password2';
      var data = {code : event.email,email:this.email};

      this._http.post(link, data)
          .subscribe(res => {

            var sdfs:string = res.text();
            if(sdfs == '0'){
              this.emailexist = true;
            }else{
              this.navCtrl.push(ForgotPass3Page,{email : this.email,id:sdfs});
            }

          }, error => {
            console.log("Oooops!");
          });


    }

  }




}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //console.log('vali email called');
  return re.test(email);
}
