import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ModalController, LoadingController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-newequipment',
  templateUrl: './newequipment.component.html',
  styleUrls: ['./newequipment.component.scss'],
})
export class NewequipmentComponent implements OnInit {

  newMachineForm = new FormGroup({
    name: new FormControl('',Validators.required),
    date: new FormControl('',Validators.required),
  });

  isLoading: boolean = false;
  

  constructor(private alertController:AlertController, private toastController:ToastController, public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) {
  }


  ngOnInit() {}

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  
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


  async addNewMachine(){
    const loading = await this.loader.create({
      message: 'Mise a jour...',
    });

    await loading.present();
    this.gym.addNewMachine(this.newMachineForm.value.name,this.newMachineForm.value.date).subscribe((data)=>{
      console.log(data);
      
      loading.dismiss();
      if (data.success==true) {
        //add a toast;
        this.presentToast(data.message);
        this.closeModal();

        loading.dismiss();
      } else {
        loading.dismiss();
        this.showAlert('Erreur',data.message);
      }
    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
    })
  }

}
