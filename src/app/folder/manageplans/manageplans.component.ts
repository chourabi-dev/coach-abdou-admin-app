import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manageplans',
  templateUrl: './manageplans.component.html',
  styleUrls: ['./manageplans.component.scss'],
})
export class ManageplansComponent implements OnInit {

  isLoading:boolean=true;
  plans=[];

  newGymPlan = new FormGroup({
    name_plan: new FormControl('',Validators.required),
    duration: new FormControl('',Validators.required),
    price: new FormControl('',Validators.required),
    
  })  
 constructor(private modalCtrl:ModalController,private api:GymproService, public alertController:AlertController,public loadingController:LoadingController,public toastController:ToastController ) { }

  async showToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async addNewPlan(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    this.api.addNewGymPlan(this.newGymPlan.value.name_plan,this.newGymPlan.value.duration,this.newGymPlan.value.price).subscribe((data)=>{
      loading.dismiss();

      if (data.success) {
        this.getCurrentGymPlans();
        // add a toast
        this.showToast(data.message);
        this.newGymPlan.reset();

      } else {
        this.showErrorAddAlert("Erreur",data.message);

        
      }

    },(error)=>{
      loading.dismiss();
    })


  }

  async showErrorAddAlert(title,message){
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showErrorAlert(msg){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Erreur',
      message: msg,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

 

  ngOnInit() {
    this.getCurrentGymPlans();
  }

  
  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }


  public getCurrentGymPlans(){
    this.isLoading=true;
    this.api.getGymPlans().subscribe((data)=>{
        if (data.success === true) {
          this.plans=data.plans
        } else {
          //show alert and dismiss
          this.showErrorAlert(data.message)
        }
        this.isLoading=false;
    },(error)=>{
        // show alert and dismiss
        this.isLoading=false;
        this.showErrorAlert("Désolé, une erreur s'est produite. Veuillez réessayer.")
    })
  }


  async delete(id){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    this.api.deleteGymPlan(id).subscribe((data)=>{
      if (data.success) {
        loading.dismiss();
        
        this.showToast(data.message);
        this.getCurrentGymPlans();

        
      } else {
        loading.dismiss();
        this.showErrorAddAlert('Erreur',data.message);
        
      }
    },(error)=>{
      loading.dismiss();
      this.showErrorAddAlert('Erreur',"Désolé, une erreur s'est produite. Veuillez réessayer.")
    })
  }

}
