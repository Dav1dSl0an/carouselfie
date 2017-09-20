import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { ToastController, LoadingController } from 'ionic-angular';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the UploadPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  url;
  uploaded= true;
  public debug_size_before: string[] = [];
  public debug_size_after: string[] = [];
  progress = false;
  public file_srcs: string[] = [];
  signingrequest;
  loading;
  imageIsHere = false;
  uploadedImage: File;
  imagePreview: string;
  imageWidth;
  imageHeight;

  

  constructor(public sanitizer: DomSanitizer, private ng2ImgMax: Ng2ImgMaxService, public loadingCtrl: LoadingController, private changeDetectorRef: ChangeDetectorRef, private el: ElementRef, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, private api: Api) {
    
  }

  onImageChange(event) {
    let image = event.target.files[0];
    
    this.presentLoadingDefault("Processing...");
    //this.ng2ImgMax.resizeImage(image, 400, 300).subscribe(
      this.ng2ImgMax.compressImage(image, 0.100).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
      
        this.getImagePreview(this.uploadedImage);
        
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.uploaded=false;
      this.loading.dismiss();
    };
  }

  randomNumber(){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  upload(){
    this.progress=true;
    this.presentLoadingDefault("Uploading...");
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    console.log(inputEl);
    
    var fileType="image/jpeg";
    var file = inputEl.files.item(0);
    //var file = this.uploadedImage;
    let fileName = Date.now() + Math.random() + "." + this.randomNumber() + "." + file.name;
  
      this.api.getSignedRequest(fileName, fileType)
        .subscribe(
          data => {
            console.log(data);
            this.signingrequest=data;
            this.finalUpload(this.signingrequest, file)
          },
          error => {
            this.presentToast(error)
          },
        );
      
  }

  finalUpload(data, file){
    this.api.upload(data.signedRequest, file)
      .subscribe(
        data => {
          data.height=this.imageHeight;
          data.width=this.imageWidth;
          console.log(data);
          if (data.status=="200"){
            console.log(this.imageWidth);
            this.progress=false;
            this.uploaded=true;
            this.api.addRecord(data)
              .subscribe(
                data => {
                  console.log(data);
                  
                }
              );
            this.presentToast('Success! Thanks for Sharing');
            this.loading.dismiss();
          }
        },
        error => {
          console.log(error);
          this.presentToast(error);
          this.loading.dismiss();;
        },
      );
  }

  previewImage(event, getImageDimensions){
    this.imageIsHere=true;
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e:any) => {
        var image = new Image();
        image.src = reader.result;
        this.url = e.target.result;
        
        image.onload = function() {
          console.log (image.width);
          getImageDimensions(image.width, image.height);
        };
  };

      reader.readAsDataURL(event.target.files[0]);
      this.uploaded=false;
    }
  }

  getImageDimensions = (width, height) => {
    
    //this.imageWidth = width;
    this.imageHeight = height;
    this.imageWidth = width;
    console.log(this.imageHeight);
    console.log(this.imageWidth);
    return;
   
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

  clickButton(){

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

}
