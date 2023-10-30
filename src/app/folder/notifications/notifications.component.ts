import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { UsersService } from 'src/app/api/users.service';
import { NewgymComponent } from '../newgym/newgym.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";


  arrNotifications = [];

  gymInfo:any;
  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private router: Router,
    private gym: GymproService,
    private modalController:ModalController,
    public alert:AlertController,
    public toastController:ToastController
  ) { }

  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
           

          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
  resendVerificationMail(){
    this.isLoading = true;
    this.gym.sendVerificationMail().subscribe((data)=>{
      this.isLoading = false;
     
      if (data.success==true) {
        //add a toast;
        this.presentToast(data.message);

        
      } else {
        
        this.showAlert('Erreur',data.message);
      }
    },(error)=>{
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
    })
  }



  getGymInfo(){
    this.isLoading=true;
    this.errorLoading=false;
    this.hasAGym=false;
    this.noGymYet=false;

    this.gym.getGymDetails().subscribe((data)=>{
      this.isLoading=false;
      console.log(data);
      if(data.success == true){
        if (data.gym != null) {
          this.gymInfo = data.gym;
          this.hasAGym=true;
          this.getNotifications();

          //updating UI
          this.gymName=data.gym.name

        }else{
          this.noGymYet=true;
        }
      }
      else{
        this.errorLoading=true;
      }
      
    },(error)=>{
      this.isLoading=false;
      this.errorLoading=true;
      
    })
  }

  ngOnInit() {
    this.getGymInfo();
  }

   async createGymModal(){
    
    const modal = await this.modalController.create({
      component: NewgymComponent
    });

    modal.onDidDismiss().then(()=>{
      this.getGymInfo();
    })
    return await modal.present();
    
  }

  ionViewWillEnter(){
    this.getGymInfo();
  }


  getNotifications(){
    this.isLoading = true;
    this.arrNotifications = [];
    this.gym.getAdminNotifications().subscribe((data)=>{
      console.log(data);
      this.arrNotifications = data.notifications;
      this.isLoading = false;
      
    },(error)=>{
      this.isLoading = false;
      this.errorLoading = false;
    })
  }


}
