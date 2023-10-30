import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { PlanbuilderService } from 'src/app/api/planbuilder.service';
import { UsersService } from 'src/app/api/users.service';
import { NewgymComponent } from '../newgym/newgym.component';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
})
export class WorkoutComponent implements OnInit {
  @Input() idMember;
  @Input() workoutplan;

  jsonVersionWorkout;


  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";

  groupMusclesInput:String ="";
  

  savedPlans = [];



  Machines = [];

  arrNotifications = [];
  tmpExerseciesArrayPerDay = [];
  machineDetails :any;



  tmpSets = [];

  step = 1;

  days = 0;

  daysArr = [
    "Monday",
    "Tusday",
    "Wednesday",
    "Thrsday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  monday:any = null;
  tusday:any = null;
  wensday:any = null;
  thursday:any = null;
  firday:any = null;
  sanday:any = null;
  saturday:any = null;

  // step 1 var

  step1Form = new FormGroup({
    title:new FormControl('',Validators.required),
    goal:new FormControl('',Validators.required),
    bodySection:new FormControl('',Validators.required),
    
    duration:new FormControl('',Validators.required),
    
  })
  //end of step 1 


    // step 1 var

    exercices = [
      
    ];

    step2Form = new FormGroup({
      exercice : new FormControl('',Validators.required)
    })
    //end of step 1 
  

    exercicesFromDataBase = [];

  gymInfo:any;
  constructor(
    private auth: UsersService,
    private gym: GymproService,
    private modalController:ModalController,
    public alertControl:AlertController,
    public toastController:ToastController,
    public workout:PlanbuilderService,
    public modalCtrl:ModalController, private formBuilder: FormBuilder
  ) { }



    nexStep(){
      this.step = this.step+1;
    }

  async showAlert(title,message){
    const alert = await this.alertControl.create({
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

  getExercicesList(){
    this.isLoading=true;
    this.gym.getExercicesList().subscribe((data)=>{
      console.log(data);
      
        if (data.success === true) {
          this.exercicesFromDataBase=data.exercices
        } else {
          //show alert and dismiss
          this.showAlert("Error",data.message)
        }
        this.isLoading=false;
    },(error)=>{
        // show alert and dismiss
        this.isLoading=false;
        this.showAlert("Error","Désolé, une erreur s'est produite. Veuillez réessayer.")
    })
  }

  async addMoreReps(){
    const alert = await this.alertControl.create({
      header: "répétitions",
      message: "Ajouter plus de répétitions.",
      inputs:[
        {
          name:"reps",
          type:"number",
          placeholder: "répétitions"
        },

        {
          name:"pause",
          type:"number",
          placeholder: "pause (sec)"

        },

        

      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {

          }
        },

        {
          text: 'Ajouter',
          cssClass: 'secondary',
          handler: async (data) => {
              console.log(data);
              this.tmpSets.push(data);
              

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
      this.errorLoading = true;
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

          this.getSavedPlans();

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
    this.getExercicesList();

    this.jsonVersionWorkout = JSON.parse(this.workoutplan);
    console.log( this.jsonVersionWorkout );

    this.initAllForms();


  }

  initAllForms(){
    this.step1Form.setValue({
      title:this.jsonVersionWorkout.title,
      goal:this.jsonVersionWorkout.goal,
      bodySection:this.jsonVersionWorkout.bodysection,
      duration:this.jsonVersionWorkout.duration,
    })

    this.monday = this.jsonVersionWorkout.program.monday


    // init tmp exercices for monday
    this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.monday != null ?this.jsonVersionWorkout.program.monday.exercices : [];
    this.groupMusclesInput = this.jsonVersionWorkout.program.monday != null ? this.jsonVersionWorkout.program.monday.split : "";
  }






  addexercice(){
    

    this.tmpExerseciesArrayPerDay.push(this.step2Form.value);

    this.step2Form.reset();


    console.log(this.tmpExerseciesArrayPerDay);
    
    
    
  }


  updateMachineDetailsVariable(){
    
    for (let i = 0; i < this.Machines.length; i++) {
      if (this.Machines[i].id_machine == this.step2Form.value.machine) {
        console.log("found");
        
        this.machineDetails = this.Machines[i];
        console.log(this.machineDetails);
        
        
        
      }
      
    }
    
    
  }



  removeSet(i){
    this.tmpSets.splice(i,1);
  }

  removeExercice(i){
    this.tmpExerseciesArrayPerDay.splice(i,1);
  }

  async editExercie(i) {
    const alert = await this.alertControl.create({
      header: "Update",
      message: "update exercise details.",
      inputs:[
        {
          name:"title",
          type:"text",
          placeholder: "Title ",
          value:this.tmpExerseciesArrayPerDay[i].exercice.title_exercice
        },
        {
          name:"bodysection",
          type:"text",
          placeholder: "Body section",
          value:this.tmpExerseciesArrayPerDay[i].exercice.body_section
        },
        {
          name:"instruction_exercice",
          type:"textarea",
          placeholder: "Instructions",
          value:this.tmpExerseciesArrayPerDay[i].exercice.instruction_exercice
        },
        {
          name:"sets",
          type:"number",
          placeholder: "Set(s)",
          value:this.tmpExerseciesArrayPerDay[i].exercice.sets
        },
        {
          name:"reps",
          type:"number",
          placeholder: "Rep(s)",
          value:this.tmpExerseciesArrayPerDay[i].exercice.reps
        },

        {
          name:"pause",
          type:"number",
          placeholder: "pause (sec)",
          value:this.tmpExerseciesArrayPerDay[i].exercice.pause

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
            
            this.tmpExerseciesArrayPerDay[i].exercice.reps=data.reps;
            this.tmpExerseciesArrayPerDay[i].exercice.pause=data.pause;
            this.tmpExerseciesArrayPerDay[i].exercice.sets=data.sets;
            this.tmpExerseciesArrayPerDay[i].exercice.instruction_exercice=data.instruction_exercice;
            this.tmpExerseciesArrayPerDay[i].exercice.title_exercice=data.title;
            this.tmpExerseciesArrayPerDay[i].exercice.body_section=data.bodysection;

              

          }
        }
      ]
    });

    await alert.present();
  }


  skipDay(){
    this.goToNextDay();

    this.step2Form.reset();
  }

  goToNextDay(){
    this.days = this.days+1;

    if (this.days == 7) {
      console.log("we are done ");

      
      
    }else{
      switch (this.days) {


          case 1:
          
          
          this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.tusday != null ?this.jsonVersionWorkout.program.tusday.exercices : [];
          this.groupMusclesInput =this.jsonVersionWorkout.program.tusday != null ? this.jsonVersionWorkout.program.tusday.split : "";
          this.tusday = {
            exercices: this.tmpExerseciesArrayPerDay,
            split:this.jsonVersionWorkout.program.tusday != null ? this.jsonVersionWorkout.program.tusday.split : ""
          };
  
          break;

          case 2:
          
          this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.wensday != null ? this.jsonVersionWorkout.program.wensday.exercices : [];
          this.groupMusclesInput =this.jsonVersionWorkout.program.wensday != null ? this.jsonVersionWorkout.program.wensday.split : "";
          this.wensday = {
            exercices: this.tmpExerseciesArrayPerDay,
            split:this.jsonVersionWorkout.program.wensday != null ? this.jsonVersionWorkout.program.wensday.split : ""
          };
  
          break;
          case 3:

          this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.thursday != null ? this.jsonVersionWorkout.program.thursday.exercices : [];
          this.groupMusclesInput =this.jsonVersionWorkout.program.thursday != null ? this.jsonVersionWorkout.program.thursday.split : "";
          this.thursday = {
            exercices: this.tmpExerseciesArrayPerDay,
            split:this.jsonVersionWorkout.program.thursday != null ? this.jsonVersionWorkout.program.thursday.split : ""
          };
  
          break;
          case 4:
          
          this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.friday != null ? this.jsonVersionWorkout.program.friday.exercices : [];
          this.groupMusclesInput =this.jsonVersionWorkout.program.friday != null ? this.jsonVersionWorkout.program.friday.split : "";
          this.firday = {
            exercices: this.tmpExerseciesArrayPerDay,
            split:this.jsonVersionWorkout.program.friday != null ? this.jsonVersionWorkout.program.friday.split : ""
          };
  
          break;
          case 5:
            this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.saturday != null ? this.jsonVersionWorkout.program.saturday.exercices : [];
            this.groupMusclesInput =this.jsonVersionWorkout.program.saturday != null ? this.jsonVersionWorkout.program.saturday.split : "";
            this.saturday = {
              exercices: this.tmpExerseciesArrayPerDay,
              split:this.jsonVersionWorkout.program.saturday != null ? this.jsonVersionWorkout.program.saturday.split : ""
            };

  
          break;
          case 6:
          this.tmpExerseciesArrayPerDay = this.jsonVersionWorkout.program.sanday != null ? this.jsonVersionWorkout.program.sanday.exercices :[];
          this.groupMusclesInput =this.jsonVersionWorkout.program.sanday != null ? this.jsonVersionWorkout.program.sanday.split : "";
          this.sanday = {
            exercices: this.tmpExerseciesArrayPerDay,
            split:this.jsonVersionWorkout.program.sanday != null ? this.jsonVersionWorkout.program.sanday.split : ""
          };          

  
          break;

          
      
        default:
          break;
      }

      // empty tmps
      

      this.step2Form.reset();

      
      
    }
    
  }


  doneMakingProgram(){
    let program = {
      monday : this.monday.exercices.length==0 ? null : this.monday,
      tusday : this.tusday.exercices ==0 ? null : this.tusday,
      wensday : this.wensday.exercices ==0 ? null : this.wensday,
      thursday : this.thursday.exercices ==0 ? null : this.thursday,
      friday: this.firday.exercices ==0 ? null : this.firday,
      sanday : this.sanday.exercices ==0 ? null : this.sanday,
      saturday : this.saturday.exercices ==0 ? null : this.saturday,
      
    }

    let plan = {
      title: this.step1Form.value.title,
      goal: this.step1Form.value.goal,
      duration: this.step1Form.value.duration,
      bodysection: this.step1Form.value.bodySection,
      
      program: program
      
    }

    console.log(plan);

    // send it to server
    this.isLoading = true;

    console.log(plan);
    

    this.gym.updateMembreWorkoutData(this.idMember, JSON.stringify(plan)).subscribe((res)=>{
      this.presentToast(res.message);
      if (res.success == true) {
        this.resetAll();
        this.closeModal();
      }
      this.isLoading = false;
    },(error)=>{
      this.showAlert("Erreur","une erreur s'est produite lors de la tentative d'ajout du plan");
      this.isLoading = false;
    })
  }

  resetAll(){
    this.step = 1;
    this.step1Form.reset();
    this.step2Form.reset();
    this.tmpExerseciesArrayPerDay= [];

    this.step2Form.reset();
    this.machineDetails = null;
    this.tmpSets = [];

    
    this.days = 0;

    this.getSavedPlans();

  }
  
  


  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
