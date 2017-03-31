import { Component } from '@angular/core';
import {Storage, LocalStorage,NavController, NavParams} from 'ionic-angular';
import * as $ from "jquery";
import {Http, Headers} from "@angular/http";
import '../../../node_modules/chart.js/src/chart.js';
import { BaseChartComponent } from 'ng2-charts/ng2-charts';

/*
  Generated class for the DailypollresultPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/dailypollresult/dailypollresult.html',
    directives: [BaseChartComponent]
})
export class DailypollresultPage {
  private item;
  private itemdet;
    private isLoad;
    private newLabels;

    public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    public pieChartData:number[] = [300, 500, 100];
    public pieChartType:string = 'pie';
    public pieChartOption:any = {
        animation: false,
        responsive: true,

        title: {
            display: false
        },
        legend : {
            display: false
        }
    };
    public pieChartColors:Array<any> = [
        { // grey
            backgroundColor: ['#F7931E','#58595B','#9A9C9B','#231F20','#EBEBEB','#FAC88D']
        }
    ];

  constructor(private navCtrl: NavController,private _navParams: NavParams,private _http: Http) {
    this.item=this._navParams.get("item");
      this.isLoad = false;

    var link = 'http://torqkd.com/user/ajs2/getpolllllResultnew';
    var data = {poll_id:this.item.ques_id};



    this._http.post(link, data)
        .subscribe(res => {
          this.itemdet = res.json();

            this.newLabels = [];

            for(let n in this.itemdet.answer){
                this.newLabels.push(this.itemdet.answer[n]+' : '+this.itemdet.voteno[n]);
            }

            this.isLoad = true;
          console.log(this.itemdet);
        }, error => {
          console.log("Oooops!");
          this.navCtrl.pop();
        });


  }

  goback(){
    this.navCtrl.pop();
  }

    getpieChartData(item){
        var rarr = [];
        for(let n in item.voteno){
            rarr.push(item.voteno[n]);
        }
        return rarr;
    }

    getpieChartLabels(item){
        var rarr = [];
        for(let n in item.answer){
            rarr.push(item.answer[n]);
        }
        return rarr;
    }

}
