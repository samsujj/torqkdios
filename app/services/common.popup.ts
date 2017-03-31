export class CommonPopupService {
  items:Array<any>;
  //http:Http;

  constructor() {
    //this.http=http;
    this.items = [
      { serverUrl: 'http://localhost:8001/' },
      { name: 'Pascal Precht' },
      { n2: 'thoughtram' }
    ];
  }

  getItems() {
    return this.items;
  }

}