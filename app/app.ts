import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav,Storage, LocalStorage} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {HomePage} from './pages/home/home';
import {ProfilePage} from './pages/profile/profile';
import {NotificationPage} from './pages/notification/notification';
import {FriendsPage} from './pages/friends/friends';
import {AlbumPage} from './pages/album/album';
import {CommunityPage} from './pages/community/community';
import {TorqkdtvPage} from './pages/torqkdtv/torqkdtv';
import {ViewroutesPage} from './pages/viewroutes/viewroutes';
import {AddeventsPage} from './pages/addevents/addevents';
import {AddgroupsPage} from './pages/addgroups/addgroups';
import {AddroutesPage} from './pages/addroutes/addroutes';
import {ForumPage} from './pages/forum/forum';
import {DailypollPage} from './pages/dailypoll/dailypoll';
import {EventmapPage} from './pages/eventmap/eventmap';
import {MysportsPage} from './pages/mysports/mysports';
import {UpdateprofilePage} from './pages/updateprofile/updateprofile';
import {SportsPage} from './pages/sports/sports';
import {ExperiencePage} from './pages/experience/experience';
import {LogoutPage} from './pages/logout/logout';
import {PhotoPage} from './pages/photo/photo';
import {Http, Headers} from "@angular/http";

import { Network } from 'ionic-native';


@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  private submenuopen = 0;

  // make HelloIonicPage the root (or first) page
  private rootPage;
  pages: Array<{title: string, component: any}>;

  private sportslist;
  private local:LocalStorage;

  public isInternet;


  constructor(
    public platform: Platform,
    public menu: MenuController,private _http: Http
  ) {
    this.initializeApp();



    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.rootPage = ProfilePage;
      }
      else{
        this.rootPage = HomePage;
      }
    }).catch((err)=>{
      this.rootPage = HomePage;
    });

    // set our app's pages
    this.pages = [
      { title: 'Notifications', component: NotificationPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Friends', component: FriendsPage },
      { title: 'Community', component: CommunityPage },
      { title: 'Album', component: AlbumPage },
      { title: 'COMMUNITY PHOTOS', component: PhotoPage },
      { title: 'Torkq TV', component: TorqkdtvPage },
      { title: 'View Routes', component: ViewroutesPage },
      { title: 'Add Events', component: AddeventsPage },
      { title: 'Add Groups', component: AddgroupsPage },
      { title: 'Add Routes', component: AddroutesPage },
      { title: 'Forum', component: ForumPage },
      { title: 'Daily Poll', component: DailypollPage },
      { title: 'Event Map', component: EventmapPage },
      { title: 'My Sports', component: MysportsPage },
      { title: 'Update Profile', component: UpdateprofilePage },
      { title: 'Sports', component: SportsPage },
      { title: 'Experience', component: ExperiencePage },
      { title: 'Logout', component: LogoutPage },

    ];


    /***************sport slider [start]********************/
    var link1 = 'http://torqkd.com/user/ajs2/GetParentSports';
    var data1 = {};

    this._http.post(link1, data1)
        .subscribe(res1 => {

          this.sportslist = res1.json();

        }, error => {
          console.log("Oooops!");
        });
    /***************sport slider [end]********************/







  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      /*if (Splashscreen) {
        setTimeout(() => {
          Splashscreen.hide();
        }, 100);
      }*/

      if(Network.connection === 'none'){
        this.isInternet = 0;
      }else{
        this.isInternet = 1;
      }



      let disconnectSubscription = Network.onDisconnect().subscribe(() => {
        this.isInternet = 0;
      });

      let connectSubscription = Network.onConnect().subscribe(() => {
        this.isInternet = 1;
      });


      if (StatusBar) {
        // hide StatusBar using cordova-plugin-statusbar
        setTimeout(() => {
          StatusBar.backgroundColorByHexString("#B2B2B2")
        },100);
      }
    });
  }

  openPage(page) {
    this.submenuopen = 0;
    if(page.title == 'Sports'){
      this.submenuopen = 1 - this.submenuopen;
      return false;
    }
    this.submenuopen = 0;
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);

  }

  showReorder(item){
    if(item.title == 'Sports'){
      return true;
    }else{
      return false;
    }
  }

  opensportspage(id){
    this.submenuopen = 0;
    this.menu.close();
    this.nav.push(SportsPage, { id : id});
  }

  checkInternet(){
    return 1;
  }

  openmenu(){
    this.menu.toggle();
  }


}

ionicBootstrap(MyApp);
