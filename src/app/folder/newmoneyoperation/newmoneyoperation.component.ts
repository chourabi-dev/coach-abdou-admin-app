import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';

@Component({
  selector: 'app-newmoneyoperation',
  templateUrl: './newmoneyoperation.component.html',
  styleUrls: ['./newmoneyoperation.component.scss'],
})
export class NewmoneyoperationComponent implements OnInit {

  newMoneyOperationForm = new FormGroup({
    title: new FormControl('',[Validators.required]),
    type: new FormControl('0',[Validators.required]),
    amount: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    
  })
  isLoading: boolean = false;

  constructor(public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) { }

  ngOnInit() {

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



  async submitMoneyTransaction(){
    const loading = await this.loader.create({
      message: 'Chargement...',
    });
    await loading.present();
    var amount = this.newMoneyOperationForm.value.type === '0'  ? (this.newMoneyOperationForm.value.amount *-1) :  (this.newMoneyOperationForm.value.amount);  
    console.log(amount);
    
    this.gym.newFinancialOperartion(this.newMoneyOperationForm.value.title,this.newMoneyOperationForm.value.description,amount).subscribe((data)=>{
      loading.dismiss();
      if (data.success==true) {
        this.closeModal();
      } else {
        this.showAlert('Erreur',data.message);
      }
    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
    })
  }


}
