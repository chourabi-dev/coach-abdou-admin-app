import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';

@Component({
  selector: 'app-editpaymentdata',
  templateUrl: './editpaymentdata.component.html',
  styleUrls: ['./editpaymentdata.component.scss'],
})
export class EditpaymentdataComponent implements OnInit {

  @Input() data:any;

  /**
   * 
   * {id_payment: 46, amount: 45, title: "Inscription", description: "Frais d'inscription.", date: "2020-09-28 13:23:00"}
   */
  editPaymentData = new FormGroup({
    title: new FormControl('',[Validators.required]),
    amount: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    
  })
  isLoading: boolean = false;


  constructor(
    public modalCtrl:ModalController,
    private toastController:ToastController,
    public alert:AlertController,
    private gym:GymproService,
    private loader:LoadingController
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.editPaymentData.setValue({
      title:this.data.title,
      amount:this.data.amount,
      description:this.data.description

    })
  }

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
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
            
            this.closeModal()

          }
        }
      ]
    });

    await alert.present();
  }


  async updatePayment(){

    const loading = await this.loader.create({
      message: 'Suppression...',
    });

    await loading.present();
    var fv = this.editPaymentData.value;
    this.gym.updateMemberpayment(this.data.id_payment,fv.title,fv.description,fv.amount).subscribe((data)=>{

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
