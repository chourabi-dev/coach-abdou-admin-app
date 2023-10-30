import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';

@Component({
  selector: 'app-machinesupdate',
  templateUrl: './machinesupdate.component.html',
  styleUrls: ['./machinesupdate.component.scss'],
})
export class MachinesupdateComponent implements OnInit {

  isLoading: boolean = false;

  updateGymdata = new FormGroup({
    duration: new FormControl('0',Validators.required)
  })


  constructor(private alertController:AlertController, private toastController:ToastController, public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) {
  }


  ngOnInit() {
    this.getGymInfo();
  }

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  
  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: ['OK']
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


  getGymInfo() {
    this.isLoading = true;

    this.gym.getGymDetails().subscribe((data) => {
      this.isLoading = false;
      console.log(data);
      if (data.success == true) {
        if (data.gym != null) {
          this.updateGymdata.setValue({
            duration:data.gym.check_equipments_duration_days
          })
        }else{
          this.showAlert('Erreur',"On dirait que vous devez d'abord créer une salle de sport.");
          this.closeModal();
        }

      }else{
        this.showAlert('Erreur',"On dirait que vous devez d'abord créer une salle de sport");
        this.closeModal();
      }
      

    }, (error) => {
      this.isLoading = false;
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
      this.closeModal();

    })
  }


  async updateMachineCheckDuration(){
    const loading = await this.loader.create({
      message: 'Mise a jour...',
    });

    await loading.present();
    this.gym.updateGymMachineCheckDuration(this.updateGymdata.value.duration).subscribe((data)=>{
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
