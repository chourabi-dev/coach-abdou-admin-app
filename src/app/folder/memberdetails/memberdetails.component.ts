import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkoutComponent } from '../workout/workout.component';
import { MoreuserinfoComponent } from '../moreuserinfo/moreuserinfo.component';
import { ProgressmemberComponent } from '../progressmember/progressmember.component';
import { DietdetailsComponent } from '../dietdetails/dietdetails.component';

@Component({
  selector: 'app-memberdetails',
  templateUrl: './memberdetails.component.html',
  styleUrls: ['./memberdetails.component.scss'],
})
export class MemberdetailsComponent implements OnInit {

  @Input() idMember: string;
  @Input() fullname: string;
  isLoading:boolean=true;

  avatar:any="";
  pricingPlan:any={};
  phone:any;
  email:any;
  address:any="";
  lastRenewalDate:any;
  historyOfPayments:any;
  daysLeft:number=0;
  RegistrationDate:any;
  status:number=0;
  isArchived:any;
  reduction:any;
  reste=0;

  workoutplan = null;

  moreInfo:any;
  progress:any;

  diet = null;


  fcm = null;
  isUsingApp = false;


  sex:any="Chargement..."
  plans:any=[];

  FileTodUpload:File;

  EditIsShown:boolean=false;
  idPlanToUpdate:any;

  //did pay at least once
  didPay:any;

  editMembreData = new FormGroup({
    name: new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    idPlan : new FormControl('',[Validators.required]),
    sex : new FormControl('',[Validators.required]),

    addDate : new FormControl('',[Validators.required]),

    workoutplan: new FormControl(''),
    dietPlan : new FormControl('')
    
    
    
  })

  savedPlans = [];
  diets = [];

  constructor(public modalController:ModalController, private router:Router, private alertController:AlertController, private toastController:ToastController, public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) {
    
  }

  async editWorkoutDetails(){

    const modal = await this.modalController.create({
      component: WorkoutComponent,
      componentProps: {
        'idMember': this.idMember,
        'workoutplan': this.workoutplan.json_workout
      }
    });

    return await modal.present();
  }


  async editDietDetails(){

    const modal = await this.modalController.create({
      component: DietdetailsComponent,
      componentProps: {
        'idMember': this.idMember,
        'diet': JSON.parse(this.diet.data_duplication)
      }
    });

    modal.onDidDismiss().then(()=>{
      this.closeModal();
    })

    return await modal.present();
  }

  getDietTitle(){
    let title = JSON.parse(this.diet.data_duplication).info.title;
    return title;
  }


  getDiets(){
    this.isLoading = true;

    this.gym.getDietsList().subscribe((data)=>{
      this.isLoading=false;
      console.log(data);
      if(data.success == true){
        this.diets = data.diets;
        console.log(this.diets);
        
      }
      else{
        
      }
      
    },(error)=>{
      this.isLoading=false;
      
    })

  }




  async moreInfoModal(){
    const modal = await this.modalController.create({
      component: MoreuserinfoComponent,
      componentProps: {
        'progress': this.progress,
        'moreInfo': this.moreInfo
      }
    });

    return await modal.present();
  }

  async progressCheckModal(){
    const modal = await this.modalController.create({
      component: ProgressmemberComponent,
      componentProps: {
        'progress': this.progress,
        'moreInfo': this.moreInfo
      }
    });

    return await modal.present();
  }

  ngOnInit() { 
    console.log(this.idMember);
    this.getGymPlans()  ;
    this.getSavedPlans();
    this.getDiets();
  }

  toggleEdit(){
    this.EditIsShown= ! this.EditIsShown;
  }
  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  getSavedPlans(){
    this.savedPlans = [];

    this.isLoading = true;
    this.gym.getGymWorkoutPlans().subscribe((data)=>{
      this.isLoading = false;

      console.log(data);

      if (data.success) {
        data.plans.forEach(plan => {
          let tmp = {
            add_date: plan.add_date,
            id_gym: plan.id_gym,
            id_workout: plan.id_workout,
            json_boc: JSON.parse(plan.json_boc)
          }
          this.savedPlans.push(tmp);
        });

        console.log(this.savedPlans);
        
      }
      


    },(error)=>{
      this.isLoading= false;
    })
  }


  affectTraining(){

  }

  goToWorkout(){
    this.closeModal();
    this.router.navigate(['/home/workout/'+this.idMember]);
  }

  async deleteMembre(){
    const alert = await this.alert.create({
      header: "Supprimer le membre",
      message: "Voulez-vous vraiment supprimer ce mebre?, Rappelez-vous qu'une fois supprimés, tous les enregistrements de paiement seront également supprimés et ne pourront plus être récupérés.",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
            this.closeModal()

          }
        },
        {
          text: 'Archiver',
          cssClass: 'secondary',
          handler: async () => {
            
            this.archiveMembre();

          }
        },
        {
          text: 'Supprimer',
          cssClass: 'danger',
          handler: () => {
            
            this.deleteMembreNow();

          }
        },
        
      ]
    });

    await alert.present();
  }

  async deleteMembreNow(){
    console.log(this.editMembreData.value);
    const loading = await this.loader.create({
      message: 'Suppression...',
    });

    await loading.present();
    this.gym.deleteMemberFromGym(this.idMember).subscribe((data)=>{

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


  async getAppCode(){
    const loading = await this.loader.create({
      message: 'Mise a jour...',
    });

    await loading.present();
    this.gym.generateAppCode(this.idMember).subscribe((data)=>{
      console.log(data);
      
      loading.dismiss();
      if (data.success==true) {
        //add a toast;
        this.showAlert('Code application',"le code de connexion pour "+ this.fullname +" est : <br/><strong>"+data.code+"</strong>.");
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



  async updateUserData(){
    console.log(this.editMembreData.value);
    const loading = await this.loader.create({
      message: 'Mise a jour...',
    });

    await loading.present();
    this.gym.updateMemberData(this.idMember,this.editMembreData.value.name,this.editMembreData.value.phone,this.editMembreData.value.idPlan,0,this.editMembreData.value.sex,this.editMembreData.value.addDate,0,this.editMembreData.value.workoutplan,this.editMembreData.value.dietPlan ).subscribe((data)=>{
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


  getGymPlans(){
    this.isLoading=true;
    this.gym.getGymPlans().subscribe((data)=>{
      this.isLoading=false;
      
      if (data.success==true) {
        this.plans=data.plans;
        this.getMemberDetails();
      } else {
        this.showAlert('Erreur',data.message);
        this.closeModal();
      }


    },(error)=>{
      this.isLoading=false;
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
      this.closeModal();
    })
  }


  async resetMemberPaswword(){

    const alert = await this.alertController.create({
      header: 'réinitialiser le mot de passe',
      message: "Voulez-vous vraiment réinitialiser le mot de passe de ce membre?",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Continuer',
          handler: async () => {
            const loading = await this.loader.create({
              message: 'Chargement...',
            });
            await loading.present();
        
            this.gym.resetPassword(this.idMember).subscribe((data)=>{
              loading.dismiss();
              if (data.success==true) {
                this.presentToast(data.message);
                
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
        ]

      });
        
      alert.present();


  }


  async sendMessage(){
    const alert = await this.alertController.create({
      header: 'Envoyer un message',
      message: "L'utilisateur sera directement informé dans son application mobile.",
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Titre ( Exml: Paiement )'
        },
        {
          name: 'message',
          type: 'textarea',
          placeholder: 'message'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Envoyer',
          handler: async (data) => {
            const loading = await this.loader.create({
              message: 'Chargement...',
            });
            console.log(data);
            
            await loading.present();
        
            this.gym.sendMessage(this.idMember,data.title,data.message).subscribe((data)=>{
              loading.dismiss();
              if (data.success==true) {
                this.presentToast(data.message);
                
               
              } else {
                this.showAlert('Erreur',data.message);
              }
        
        
            },(error)=>{
              loading.dismiss();
              this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
            })
        
          }
        }
        ]

      });
        
      alert.present();
  }

  getMemberDetails(){
    console.log(this.idMember);
    
    this.gym.getMemberDetails(this.idMember).subscribe((data)=>{
      this.isLoading=false;
      console.log(data);
      
      if (data.success==true) {
        this.avatar=data.avatar;
        this.phone=data.phone;
        this.email=data.email;
        this.pricingPlan=data.pricingPlan;
        this.lastRenewalDate=data.lastRenewalDate;
        this.historyOfPayments=data.history;
        this.RegistrationDate=data.RegistrationDate;
        this.isArchived=data.isArchived;
        //this.address = data.

        this.sex=data.sex;

        this.fcm = data.fcm;
        this.isUsingApp = data.isConnected;
        this.workoutplan = data.workoutplan;
        this.progress = data.porogress;
        this.moreInfo = data.more_info;
        this.diet = data.diet;

        this.editMembreData.setValue({
          name:data.fullname,
          phone:data.phone,
          idPlan:data.pricingPlan.id+"",

          sex:data.sex,
          addDate:data.RegistrationDate,

          workoutplan: data.workoutplan == null ? '': data.workoutplan.id_workout+"",
          dietPlan  : data.diet == null ? '': data.diet.id_diet+""
        });

        
        

        //now we check his payments
        let lastRenewalDate =new Date(this.lastRenewalDate);
        let today = new Date();
        let hoursCounted = (((today.getTime()-lastRenewalDate.getTime())/1000)/60)/60;
        let daysPasses= hoursCounted / 24;
        this.daysLeft=this.pricingPlan.duration-Math.round(daysPasses);
        
        if( this.daysLeft > 3){
          this.status=3;
        }else if( this.daysLeft <=3 && this.daysLeft > 0 ){
          this.status=2;
        }else if (this.daysLeft<= 0) {
          this.status=1;
        }

        console.log(this.status);
        
        



      } else {
        this.showAlert('Erreur',data.message);
      }
    },(error)=>{
      console.log(error);
      
      this.isLoading=false;
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
    })
  }



  getPlanTitle(){
    let title = JSON.parse(this.workoutplan.json_workout).title;
    return title;

  }



  async archiveMembre(){
    const loading = await this.loader.create({
      message: 'Chargement...',
    });
    await loading.present();

    this.gym.archiveMembre(this.idMember).subscribe((data)=>{
      loading.dismiss();
      if (data.success==true) {
        this.presentToast(data.message);
        
        this.closeModal();
      } else {
        this.showAlert('Erreur',data.message);
      }


    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
    })
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async unArchiveMembre(){
    const loading = await this.loader.create({
      message: 'Chargement...',
    });
    await loading.present();

    this.gym.unarchiveMembre(this.idMember).subscribe((data)=>{
      loading.dismiss();
      if (data.success==true) {
        this.presentToast(data.message);

        this.closeModal();
      } else {
        this.showAlert('Erreur',data.message);
      }


    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
    })
  }




   async renewelMembre(e){

    var message = 'Voulez-vous vraiment renouveler l&lsquo;abonnement du membre <strong>'+this.fullname+'</strong>. ';
    var inputs = [];
    var wasAtTheGym = false;

    if (    this.daysLeft < 0  ) {
       message = 'Voulez-vous vraiment renouveler l&lsquo;abonnement du membre <strong>'+this.fullname+'</strong>. <br/> <p class="red-alert"> <ion-icon name="alert-circle-outline"></ion-icon> Veuillez confirmer que le membre était au gym pendant ces jours</p> ';
       inputs = [
        {
          name: 'wasAtTheGym',
          type: 'checkbox',
          label: "Oui il l'était.",
          checked: false,
          handler : (e)=>{
            console.log(e);
            wasAtTheGym=e.checked;
              
          }
          
        },
      ];
  
    }


    const alert = await this.alertController.create({
      header: 'Renouvellement',
      message: message,
      inputs:inputs,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Renouveler',
          handler: async () => {
            
            
            if (this.daysLeft > 0) {
              console.log("member still have days");

              console.log("regular renouv with left days");
                
                let date = new Date(this.lastRenewalDate);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                let oneDayMillis = 86400000 * (this.pricingPlan.duration + this.daysLeft);
                let newDate = new Date(date.getTime() + oneDayMillis);
                
                
                var yyyy = newDate.getFullYear();
                var mm = newDate.getMonth()+1;
                var dd = newDate.getDate();
                var dateToSend =yyyy+'-'+mm+'-'+dd+' ';

                console.log(dateToSend);
                
                const loading = await this.loader.create({
                  message: 'Chargement...',
                });
                await loading.present();
            
                this.gym.renewelMembre(this.idMember,dateToSend).subscribe((data)=>{
                  loading.dismiss();
                  if (data.success==true) {
                    this.presentToast(data.message);
                    this.closeModal();
                  } else {
                    this.showAlert('Erreur',data.message);
                  }
            
            
                },(error)=>{
                  loading.dismiss();
                  this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
                })
          
              
            } else {
              console.log(wasAtTheGym," was at gym");

              console.log("member out of days");
              

              // days left < 0 

              if (  wasAtTheGym === false  ) {

                console.log("was not at the gymm ");
                var newStartDate= new Date();
                var yyyy = newStartDate.getFullYear();
                var mm = newStartDate.getMonth()+1;
                var dd = newStartDate.getDate();
                var dateToSend =yyyy+'-'+mm+'-'+dd+' ';
  
                const loading = await this.loader.create({
                  message: 'Chargement...',
                });
                await loading.present();
            
                this.gym.renewelMembre(this.idMember,dateToSend).subscribe((data)=>{
                  loading.dismiss();
                  if (data.success==true) {
                    this.presentToast(data.message);
                    this.closeModal();
                  } else {
                    this.showAlert('Erreur',data.message);
                  }
            
            
                },(error)=>{
                  loading.dismiss();
                  this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
                })
                
  
                
                
              } else {
                console.log("regular renouv");
                
                let date = new Date(this.lastRenewalDate);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                let oneDayMillis = 86400000 * this.pricingPlan.duration;
                let newDate = new Date(date.getTime() + oneDayMillis);
                console.log(newDate);
                
                var yyyy = newDate.getFullYear();
                var mm = newDate.getMonth()+1;
                var dd = newDate.getDate();
                var dateToSend =yyyy+'-'+mm+'-'+dd+' ';
          
                const loading = await this.loader.create({
                  message: 'Chargement...',
                });
                
                
                await loading.present();
            
                this.gym.renewelMembre(this.idMember,dateToSend).subscribe((data)=>{
                  loading.dismiss();
                  if (data.success==true) {
                    this.presentToast(data.message);
            
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

          }
        }
      ]
    });

    await alert.present();


  }


  callMemberPhone(){
    window.location.href="tel:"+this.phone;
  }


  sendEmailToMember(){
    window.location.href="mailto:"+this.email;
  }



  /******************************************************* */

  iconClick(){
    let input:HTMLElement = document.getElementById('inputImage') as HTMLElement;
    input.click();
  }

  imageChanged(e){
    console.log(e);
    this.FileTodUpload=e.target.files[0]

    if (e.target.files.length === 0)
      return;
 
    var mimeType = e.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();
    
    reader.readAsDataURL(e.target.files[0]); 
    reader.onload = (_event) => { 
      this.avatar = reader.result; 
      this.uploadFile();
    }
  }

  async uploadFile(){
    
    const loading = await this.loader.create({
      message: 'Mise a jour...',
    });
    var form = new FormData();
    form.append("avatar", this.FileTodUpload, this.FileTodUpload.name);
    form.append("idMember", this.idMember);

    await loading.present();
    this.gym.updateMemberPhoto(form).subscribe((data)=>{
      console.log(data);
      
      loading.dismiss();
      if (data.success==true) {
        //add a toast;
        this.presentToast('Image de membre mise à jour avec succès.');

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
