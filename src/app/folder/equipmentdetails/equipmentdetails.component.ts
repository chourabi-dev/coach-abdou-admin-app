import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ToastController, ModalController, LoadingController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-equipmentdetails',
  templateUrl: './equipmentdetails.component.html',
  styleUrls: ['./equipmentdetails.component.scss'],
})
export class EquipmentdetailsComponent implements OnInit {

  @Input() machine: any;
  operationFormIsShown:boolean=false;
  newOperationForm = new FormGroup({
    title: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    date: new FormControl('',Validators.required),
    amount: new FormControl(0)
    
  })

  isLoading: boolean = false;

  constructor(private alertController:AlertController, private toastController:ToastController, public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) {
    
    
  }

  ngOnInit() {console.log(this.machine);}

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  toggleOperationForm(){
    this.operationFormIsShown= ! this.operationFormIsShown;
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

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  async addNewOperationOnMachine(){
    const loading = await this.loader.create({
      message: 'Mise a jour...',
    });

    await loading.present();
    this.gym.addNewMachineOperation(this.machine.id,this.newOperationForm.value.title,this.newOperationForm.value.description,this.newOperationForm.value.date,this.newOperationForm.value.amount).subscribe((data)=>{
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


  async deleteMachine(){
    const alert = await this.alert.create({
      header: this.machine.label,
      message: "Voulez-vous vraiment supprimer cette machine?, Rappelez-vous, que l'historique de la machine sera supprimé.",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'supprimer',
          cssClass: 'deletebtnalert',
          handler: async () => {
            const loading = await this.loader.create({
              message: 'suppression en cours...',
            });
        
            await loading.present();
            this.gym.deleteMachine(this.machine.id).subscribe((data)=>{
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
        },
        
      ]
    });

    await alert.present();
  }

}
