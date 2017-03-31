import {Component, ViewChild,Injectable} from '@angular/core';
import {NavController, Page, App, Platform, MenuController, Nav} from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import {ContactPage} from '../contact/contact'
import {LoginPage} from '../login/login'
import {AboutPage} from '../about/about'
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';




/*
  Generated class for the ProfilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Injectable()
export class MyService {
  constructor(private _http:Http) {
    this._http = _http;
  }
  getArrayData() {
    return this._http.get('./data/array.json')
        .map(data => data.json());
  }
  getPrimitiveData() {
    return this._http.get('./data/primitive.txt')
        .map(data => data.text());   // note .text() here
  }
  getBannerData() {
    return this._http.get('http://torqkd.com/user/ajs2/getAllBanner')
        .map(data => data.json());
  }
}


@Component({
  templateUrl: 'build/pages/profile/profile.html',
  //providers: [HTTP_PROVIDERS, MyService]
  providers: [MyService]

})
export class ProfilePage {
  @ViewChild(Nav) nav: Nav;

   //private _http;

  static get parameters() {
    return [
      [Platform],
      [MenuController]
    ];
  }
  mySlideOptions = {
    initialSlide: 0,
    loop: true,
    autoplay:4000
  };

  mySlideOptions2 = {
    initialSlide: 0,
    loop: true,
    autoplay:2000
  };

  mySlideOptions3 = {
    initialSlide: 0,
    loop: true,
    autoplay:1200
  };

  //private nav;
  private platform;
  private  getBannerData;
  private menu;
  private pages;
  private movies;
  private bannerdata;
  constructor(platform:Platform,menu:MenuController,private torkqservicePage: MyService, private _http:Http) {
    //this.nav = nav;

    this.platform = platform;
    this.menu = menu;
    this.torkqservicePage=torkqservicePage;
    //this._http=_http;
    //this.initializeApp();

    // the side menu links and their destinations
    // In english, Each page will display the title of the page
    // and link to what ionic page, specified under the component.
    // it'll make more sense in template soon.
    this.pages = [
      { title: 'ContactPage Page', component: ContactPage },
      { title: 'My LoginPage', component: LoginPage },
      { title: 'AboutPage', component: AboutPage }
    ];


    //this.getbanners();


    /*this._http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
      this.bannerdata = data.data.children;
    });*/





  }






  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  ionViewDidEnter() {



    /*console.log('sfdsfdf');
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var link = 'http://torqkd.com/user/ajs2/getAllBanner';
    //var data = $.param({email: event.email,password:event.password});
    //var data = JSON.stringify({email: event.email,password:event.password});
    var data = {pageid: 3,sp_id:0};

    this._http.post(link, data)
        .subscribe(data => {
          // /this.data1.response = data.json();
          console.log(data);
          if(data.json()==null){
            //this.verifylogin=false;
            console.log(JSON.stringify(data.json()));

            return;
          }
          else{

            console.log(JSON.stringify(data.json()));



          }
        }, error => {
          console.log("Oooops!");
        });*/

    this.getBannerData     = this.torkqservicePage.getBannerData();
    console.log(this.torkqservicePage);
    console.log('sfdsfdf');


  }
  makeGetRequest() {
    this._http.get("https://httpbin.org/ip")
        .subscribe(data => {
         console.log(data.json());
          //this.nav.present(alert);
        }, error => {
          console.log(JSON.stringify(error.json()));
        });
  }





}
