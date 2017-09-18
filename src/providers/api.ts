import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'https://example.com/api/v1';
  //private hostName = 'https://carouselfie.herokuapp.com'; //window.location.protocol + '//' + "10.0.1.4:4000";
  //private hostName = window.location.protocol + '//' + "10.0.1.4:4000";
  private hostName = "http://re.directto.it";
  
  constructor(public http: Http) {
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return this.http.get(this.url + '/' + endpoint, options);
  }


  getSignedRequest(fileName, fileType){
    const headers = new Headers({'Content-Type': 'image/jpeg'});
    
    return this.http.get(this.hostName +'/api/carouselfie/sign-s3?fileName='+fileName+"&fileType="+fileType,  {headers: headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  upload (signedRequest, file){
    const headers = new Headers({'Content-Type': 'image/jpeg'});
    const options = new RequestOptions({ headers: headers });
    return this.http.put(signedRequest, file, options)
      .map(response => response)
      .catch(error => Observable.throw(error));
  }

  addRecord(imageInfo: any) {
    const body = JSON.stringify(imageInfo);
    console.log(body);
    const headers = new Headers({'Content-Type': 'application/json'});
    //const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    return this.http.post(this.hostName +'/api/carouselfie/addrecord', body, {headers: headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

  getAllRecords() {
    return this.http.get(this.hostName +'/api/carouselfie/getallrecordsforuser')
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }
}
