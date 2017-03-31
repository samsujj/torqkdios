import { Component,ViewChild } from '@angular/core';
import {Storage, LocalStorage, NavController, Nav, Content, ModalController, Platform,NavParams} from "ionic-angular";
import {Http, Headers} from "@angular/http";
import * as $ from "jquery";
import {PhotocommentPage} from "../photocomment/photocomment";
import {VideocommentPage} from "../videocomment/videocomment";
import {Facebook} from 'ionic-native';
import {Fbcomment1Page} from "../fbcomment1/fbcomment1";
import {TwcommentPage} from "../twcomment/twcomment";
import { ActionSheetController,ToastController } from 'ionic-angular';
import { InAppBrowser} from "ionic-native";
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import {HomevideomodalPage} from "../homevideomodal/homevideomodal";
import {Homevideomodal1Page} from "../homevideomodal1/homevideomodal1";

/*
  Generated class for the VideodetPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/videodet/videodet.html',
})
export class VideodetPage {
    @ViewChild('chatScroll') chatScroll: Content;

  private itemdet;
  private loggedinuser;
  private local:LocalStorage;
    private poster;
    private videourl;
    private accessToken;
    private ytvdourl:SafeResourceUrl;
    private pwidth;
    private pheight;
    private emojisArr;

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http,public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,public sanitizer:DomSanitizationService,public platform: Platform) {
    this.itemdet=this._navParams.get("item");


      /****************************Get Comment[start]********************************/
      if(this.itemdet.ttype == 'video'){
          var link1 = 'http://torqkd.com/user/ajs2/getVideoComment';
          var data1 = {id : this.itemdet.id};

          this._http.post(link1,data1)
              .subscribe(data => {
                  if(data.json()==null){
                      return;
                  }
                  else{
                      this.itemdet.commentList = data.json();
                  }
              }, error => {
                  console.log("Oooops!");
              });
      }else{
          var link1 = 'http://torqkd.com/user/ajs2/getStatusComment';
          var data1 = {id : this.itemdet.id};

          this._http.post(link1,data1)
              .subscribe(data => {
                  if(data.json()==null){
                      return;
                  }
                  else{
                      this.itemdet.commentList = data.json();
                  }
              }, error => {
                  console.log("Oooops!");
              });
      }

      /****************************Get Comment[end]**********************************/



      this.pwidth = 480;
      this.pheight = 360;

      platform.ready().then((readySource) => {
          this.pwidth = platform.width();
          this.pheight = (parseInt(this.pwidth)*3)/4;
      });

      if(this.itemdet.type == 'mp4'){
          this.videourl="http://torqkd.com/uploads/video/converted/"+this.itemdet.value;
          this.poster=this.itemdet.img_src;
      }
      if(this.itemdet.type != 'mp4'){
          this.ytvdourl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.itemdet.value+'?controls=1&autoplay=1&ref=0');
      }

    this.local = new Storage(LocalStorage);

    this.local.get('userinfo').then((value) => {
      if(value!=null) {
        this.loggedinuser=JSON.parse(value).id;
      }else{
        this.loggedinuser = 0;
      }
    });



      this.emojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","walking","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface","sunny","umbrella","cloud","snowflake","snowman","zap","cyclone","foggy","ocean","cat","dog","mouse","hamster","rabbit","wolf","frog","tiger","koala","bear","pig","pig_nose","cow","boar","monkey_face","monkey","horse","racehorse","camel","sheep","elephant","panda_face","snake","bird","baby_chick","hatched_chick","hatching_chick","chicken","penguin","turtle","bug","honeybee","ant","beetle","snail","octopus","tropical_fish","fish","whale","whale2","dolphin","cow2","ram","rat","water_buffalo","tiger2","rabbit2","dragon","goat","rooster","dog2","pig2","mouse2","ox","dragon_face","blowfish","crocodile","dromedary_camel","leopard","cat2","poodle","paw_prints","bouquet","cherry_blossom","tulip","four_leaf_clover","rose","sunflower","hibiscus","maple_leaf","leaves","fallen_leaf","herb","mushroom","cactus","palm_tree","evergreen_tree","deciduous_tree","chestnut","seedling","blossom","ear_of_rice","shell","globe_with_meridians","sun_with_face","full_moon_with_face","new_moon_with_face","new_moon","waxing_crescent_moon","first_quarter_moon","waxing_gibbous_moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","last_quarter_moon_with_face","first_quarter_moon_with_face","moon","earth_africa","earth_americas","earth_asia","volcano","milky_way","partly_sunny","octocat","squirrel","bamboo","gift_heart","dolls","school_satchel","mortar_board","flags","fireworks","sparkler","wind_chime","rice_scene","jack_o_lantern","ghost","santa","christmas_tree","gift","bell","no_bell","tanabata_tree","tada","confetti_ball","balloon","crystal_ball","cd","dvd","floppy_disk","camera","video_camera","movie_camera","computer","tv","iphone","phone","telephone_receiver","pager","fax","minidisc","vhs","sound","mute","loudspeaker","mega","hourglass","hourglass_flowing_sand","alarm_clock","watch","radio","satellite","loop","mag","mag_right","unlock","lock","lock_with_ink_pen","closed_lock_with_key","key","bulb","flashlight","high_brightness","low_brightness","electric_plug","battery","calling","email","mailbox","postbox","bath","bathtub","shower","toilet","wrench","nut_and_bolt","hammer","seat","moneybag","yen","dollar","pound","euro","credit_card","money_with_wings","e-mail","inbox_tray","outbox_tray","envelope","incoming_envelope","postal_horn","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","door","smoking","bomb","gun","hocho","pill","syringe","page_facing_up","page_with_curl","bookmark_tabs","bar_chart","chart_with_upwards_trend","chart_with_downwards_trend","scroll","clipboard","calendar","date","card_index","file_folder","open_file_folder","scissors","pushpin","paperclip","black_nib","pencil2","straight_ruler","triangular_ruler","closed_book","green_book","blue_book","orange_book","notebook","notebook_with_decorative_cover","ledger","books","bookmark","name_badge","microscope","telescope","newspaper","football","basketball","soccer","baseball","tennis","8ball","rugby_football","bowling","golf","mountain_bicyclist","bicyclist","horse_racing","snowboarder","swimmer","surfer","ski","spades","hearts","clubs","diamonds","gem","ring","trophy","musical_score","musical_keyboard","violin","space_invader","video_game","black_joker","flower_playing_cards","game_die","dart","mahjong","clapper","memo","pencil","book","art","microphone","headphones","trumpet","saxophone","guitar","shoe","sandal","high_heel","lipstick","boot","shirt","necktie","womans_clothes","dress","running_shirt_with_sash","jeans","kimono","bikini","ribbon","tophat","crown","womans_hat","mans_shoe","closed_umbrella","briefcase","handbag","pouch","purse","eyeglasses","fishing_pole_and_fish","coffee","tea","sake","baby_bottle","beer","beers","cocktail","tropical_drink","wine_glass","fork_and_knife","pizza","hamburger","fries","poultry_leg","meat_on_bone","spaghetti","curry","fried_shrimp","bento","sushi","fish_cake","rice_ball","rice_cracker","rice","ramen","stew","oden","dango","egg","bread","doughnut","custard","icecream","ice_cream","shaved_ice","birthday","cake","cookie","chocolate_bar","candy","lollipop","honey_pot","apple","green_apple","tangerine","lemon","cherries","grapes","watermelon","strawberry","peach","melon","banana","pear","pineapple","sweet_potato","eggplant","tomato","corn","house","house_with_garden","school","office","post_office","hospital","bank","convenience_store","love_hotel","hotel","wedding","church","department_store","european_post_office","city_sunrise","city_sunset","japanese_castle","european_castle","tent","factory","tokyo_tower","japan","mount_fuji","sunrise_over_mountains","sunrise","stars","statue_of_liberty","bridge_at_night","carousel_horse","rainbow","ferris_wheel","fountain","roller_coaster","ship","speedboat","boat","rowboat","anchor","rocket","airplane","helicopter","steam_locomotive","tram","mountain_railway","bike","aerial_tramway","suspension_railway","mountain_cableway","tractor","blue_car","oncoming_automobile","car","red_car","taxi","oncoming_taxi","articulated_lorry","bus","oncoming_bus","rotating_light","police_car","oncoming_police_car","fire_engine","ambulance","minibus","truck","train","station","train2","bullettrain_side","light_rail","monorail","railway_car","trolleybus","ticket","fuelpump","vertical_traffic_light","traffic_light","warning","construction","beginner","atm","slot_machine","busstop","barber","hotsprings","checkered_flag","crossed_flags","izakaya_lantern","moyai","circus_tent","performing_arts","round_pushpin","triangular_flag_on_post","jp","kr","cn","us","fr","es","it","ru","uk","de","one","two","three","four","five","six","seven","eight","nine","keycap_ten","1234","zero","hash","symbols","arrow_backward","arrow_down","arrow_forward","arrow_left","capital_abcd","abcd","abc","arrow_lower_left","arrow_lower_right","arrow_right","arrow_up","arrow_upper_left","arrow_upper_right","arrow_double_down","arrow_double_up","arrow_down_small","arrow_heading_down","arrow_heading_up","leftwards_arrow_with_hook","arrow_right_hook","left_right_arrow","arrow_up_down","arrow_up_small","arrows_clockwise","arrows_counterclockwise","rewind","fast_forward","information_source","ok","twisted_rightwards_arrows","repeat","repeat_one","new","top","up","cool","free","ng","cinema","koko","signal_strength","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7a7a","u7981","sa","restroom","mens","womens","baby_symbol","no_smoking","parking","wheelchair","metro","baggage_claim","accept","wc","potable_water","put_litter_in_its_place","secret","congratulations","m","passport_control","left_luggage","customs","ideograph_advantage","cl","sos","id","no_entry_sign","underage","no_mobile_phones","do_not_litter","non-potable_water","no_bicycles","no_pedestrians","children_crossing","no_entry","eight_spoked_asterisk","eight_pointed_black_star","heart_decoration","vs","vibration_mode","mobile_phone_off","chart","currency_exchange","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","six_pointed_star","negative_squared_cross_mark","a","b","ab","o2","diamond_shape_with_a_dot_inside","recycle","end","on","soon","clock1","clock130","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","heavy_dollar_sign","copyright","registered","tm","x","heavy_exclamation_mark","bangbang","interrobang","o","heavy_multiplication_x","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","white_flower","100","heavy_check_mark","ballot_box_with_check","radio_button","link","curly_loop","wavy_dash","part_alternation_mark","trident","black_square","white_square","white_check_mark","black_square_button","white_square_button","black_circle","white_circle","red_circle","large_blue_circle","large_blue_diamond","large_orange_diamond","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","shipit"];


  }

  goback(){
    this.navCtrl.pop();
  }

  updatelike(itemid,ttype){
    if(this.loggedinuser > 0){

        if(ttype == 'video'){
            var link1 = 'http://torqkd.com/user/ajs2/likevideo/id/'+itemid+'/userid/'+this.loggedinuser;
        }else{
            var link1 = 'http://torqkd.com/user/ajs2/likestatus/id/'+itemid+'/userid/'+this.loggedinuser;
        }

      var data1 = {userid :this.loggedinuser};

      this._http.post(link1,data1)
          .subscribe(data => {
            if(data.json()==null){
              return;
            }
            else{
              this.itemdet.likeStatus = data.json().is_like;
              this.itemdet.likeNo = data.json().like_no;
            }
          }, error => {
            console.log("Oooops!");
          });
    }
  }

  showComment(item){
      if(item.ttype == 'video'){
          var link1 = 'http://torqkd.com/user/ajs2/getVideoComment';
          var data1 = {id : item.id};

          this._http.post(link1,data1)
              .subscribe(data => {
                  if(data.json()==null){
                      return;
                  }
                  else{
                      item.commentList = data.json();
                  }

                  let modal = this.modalCtrl.create(VideocommentPage, {
                      "item": item,
                  });

                  modal.present();

              }, error => {
                  console.log("Oooops!");
              });
      }else{
          var link1 = 'http://torqkd.com/user/ajs2/getStatusComment';
          var data1 = {id : item.id};

          this._http.post(link1,data1)
              .subscribe(data => {
                  if(data.json()==null){
                      return;
                  }
                  else{
                      item.commentList = data.json();
                  }

                  let modal = this.modalCtrl.create(PhotocommentPage, {
                      "item": item,
                  });

                  modal.present();

              }, error => {
                  console.log("Oooops!");
              });
      }
  }

    showSocilaShareList(item){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Share',
            cssClass : 'socilashareactionsheet',
            buttons: [
                {
                    text: '',
                    handler: () => {
                        Facebook.login(["email","public_profile"]).then((result) => {

                            if(result.status == 'connected'){
                                this.accessToken = result.authResponse.accessToken;
                                if(item.type == 'mp4'){
                                    let modal = this.modalCtrl.create(Fbcomment1Page, {
                                        "item": item, "accessToken" : this.accessToken
                                    });

                                    modal.present();

                                }else if(item.type == 'youtube'){
                                    let modal = this.modalCtrl.create(Fbcomment1Page, {
                                        "item": item, "accessToken" : this.accessToken
                                    });

                                    modal.present();
                                }





                            }else{
                                alert('An Error occured in FB Login');
                            }
                        });
                    }
                },
                {
                    text: '',
                    handler: () => {

                        var sType = 'text';
                        if(item.type == 'image'){
                            sType = 'statImg';
                        }

                        var inAppBrowserRef;

                        if(item.type == 'mp4'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item
                            });
                            modal.present();

                        }else if(item.type == 'youtube'){
                            let modal = this.modalCtrl.create(TwcommentPage, {
                                "item": item
                            });
                            modal.present();
                        }

                    }
                },
                {
                    text: '',
                    handler: () => {
                        var inAppBrowserRef;
                        inAppBrowserRef = InAppBrowser.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.img_src+'&description=',  '_blank', 'location=no');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    launchVideo1(videoid) {

        let modal = this.modalCtrl.create(Homevideomodal1Page, {
            "videoid": videoid
        });
        modal.present();
    }

    playStatusVdo(videoval,poster){
        let modal = this.modalCtrl.create(HomevideomodalPage,{"url": "http://torqkd.com/uploads/video/converted/"+videoval,"poster":poster});
        modal.present();
    }

    getsanitizedcontent(content){
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    getsanitizerstyle(index){
        if(index==0)
            return this.sanitizer.bypassSecurityTrustStyle('border-top:none');

        return;
    }


    addComment(){

        var link;

        if(this.itemdet.ttype == 'video'){
            link = 'http://torqkd.com/user/ajs2/addvidcomment';
        }else{
            link = 'http://torqkd.com/user/ajs2/addcomment';
        }

        var status_id = this.itemdet.id;
        var sess_user = this.loggedinuser;
        var cmnt_body = $('#commentemoinnertextarea').html();

        if(cmnt_body && cmnt_body != '<br>' && typeof(cmnt_body)!= 'undefined'){
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');


            var data = {status_id: status_id,sess_user:sess_user,cmnt_body:cmnt_body};


            this._http.post(link, data)
                .subscribe(data => {
                    if(this.itemdet.commentList.length)
                        this.itemdet.commentList.push(data.json());
                    else
                        this.itemdet.commentList  = [data.json()];

                    this.itemdet.commentNo = parseInt(this.itemdet.commentNo)+1;
                    $('#commentemoinnertextarea').html('');

                    $('#emojisdiv').hide();

                    this.chatScroll.scrollToBottom(200);

                }, error => {
                    console.log("Oooops!");
                });


        }else{
            alert('Please Enter Comment.');
        }
    }

    showemojidiv(){
        if ($('#emojisdiv').is(':hidden')) {
            $('#emojisdiv').show();
        }else{
            $('#emojisdiv').hide();
        }
    }

    emoinsert(emoitem){
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#commentemoinnertextarea').html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#commentemoinnertextarea').html(prevval+emoval);
    }


}
