import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { ToastController, LoadingController } from 'ionic-angular';
import {FullImagePage} from '../full-image/full-image';
/**
 * Generated class for the ViewimagesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewimages',
  templateUrl: 'viewimages.html',
})
export class ViewimagesPage implements OnInit{
  loading;
  public items:Array<any> = new Array();

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, private api: Api, public navCtrl: NavController, public navParams: NavParams, public modalCtrl : ModalController) {
    for(let i=0; i<10000; i++){
      //this.items.push(`item ${i}`);
    }
    console.log(this.items);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewimagesPage');
  }

  ionViewWillEnter()  {
    
    this.getAllRecords();
    
  }

  presentLoadingDefault(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
  
    this.loading.present();
  
    //setTimeout(() => {
     // loading.dismiss();
    //}, 5000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  openImage(imageNo){
    console.log(this.items[imageNo]);
  }

  openModal(imageNo){
    let myModal = this.modalCtrl.create(FullImagePage, this.items[imageNo]);
    myModal.present();
  }

  closeModal(){

  }

  getAllRecords(){
    this.presentLoadingDefault('Please Wait');
    this.api.getAllRecords()
    .subscribe(
      data => {
        this.items=this.processUrl(data.obj);
        //this.processUrl(data.obj);
        console.log(this.items);
        this.loading.dismiss();
      }
    );
    return;
  }

  processUrl(obj){
    
    for (var i in obj){
      var tmpUrl = obj[i].thumb.replace('thumbs','100x100');
      obj[i].thumb=tmpUrl;
      console.log(obj[i]);
    }

    return obj;

  }

  ngOnInit() {
    //this.getAllRecords();
  }

}
