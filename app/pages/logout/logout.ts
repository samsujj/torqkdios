import { Component } from '@angular/core';
import { NavController ,Storage,LocalStorage } from 'ionic-angular';
import {HomePage} from "../home/home";


/*
  Generated class for the LogoutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/logout/logout.html',
})
export class LogoutPage {
  private local;

  constructor(private navCtrl: NavController) {

  }

  ngOnInit(){
    this.local = new Storage(LocalStorage);
    this.local.remove('userinfo');
    this.navCtrl.push(HomePage);
  }

}
