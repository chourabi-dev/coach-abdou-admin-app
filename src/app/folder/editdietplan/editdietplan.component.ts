import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { PlanbuilderService } from 'src/app/api/planbuilder.service';
import { UsersService } from 'src/app/api/users.service';



@Component({
  selector: 'app-editdietplan',
  templateUrl: './editdietplan.component.html',
  styleUrls: ['./editdietplan.component.scss'],
})
export class EditdietplanComponent implements OnInit {

  @Input() diet;
  @Input() idplan;


  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";

  step1Form = new FormGroup({
    title:new FormControl('',Validators.required),
    note : new FormControl('')
    
  })

  step2Form = new FormGroup({
    mealDescription:new FormControl('',Validators.required),
    
  })

  step = 1;

  meals=[];

  diets = [];




  
  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private gym: GymproService,
    private modalController:ModalController,
    public alert:AlertController,
    public toastController:ToastController,
    public workout:PlanbuilderService,
    public loader:LoadingController
  ) { }

  ngOnInit() {
    console.log(this.diet);
    this.initDataForTheEdit();
    
  }

  async editMeal(i){
    const alert = await this.alertController.create({
      header: "répétitions",
      message: "Ajouter plus de répétitions.",
      inputs:[
        {
          name:"description",
          type:"textarea",
          placeholder: "répétitions",
          value:this.meals[i].description
        },
        

      ],
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {

          }
        },

        {
          text: 'UPDATE',
          cssClass: 'secondary',
          handler: async (data) => {
            this.meals[i].description = data.description;
          }
        }
      ]
    });

    await alert.present();
  }



  initDataForTheEdit(){
    this.step1Form.setValue({
      title:this.diet.info.title,
      note: this.diet.info.note != null  ? this.diet.info.note : ''
    });

    // update meals
    this.meals = this.diet.meals;
  }

  addMeal(){
    const meal = {
      number : this.meals.length,
      description : this.step2Form.value.mealDescription
    }

    this.meals.push(meal);

    this.step2Form.reset();
  }



  deleteMeal(i){
    this.meals.splice(i,1);
  }

  
  ionViewWillEnter(){
    this.getGymInfo();
  }

  nexStep(){
    this.step = this.step+1;
  }

  
  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirm(){
      const loading = await this.loader.create({
        message: 'Chargement...',
      });
      await loading.present();

      let dietPlan = {
        info : this.step1Form.value,
        meals : this.meals
      }

      
      this.gym.updateDietPlan(this.idplan, dietPlan).subscribe((data)=>{
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

  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
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
          this.hasAGym=true;

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

}
