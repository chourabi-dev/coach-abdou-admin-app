import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { NewgymComponent } from '../newgym/newgym.component';
import { GymproService } from 'src/app/api/gympro.service';
import { UsersService } from 'src/app/api/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";

  gymInfo:any;

  daysLeft:any = "Chargement...";
  messageAccountType="Chargement...";
  AccountType="Chargement...";
  
  machinesErr=0;
  membersErr =0;
  membersWarr = 0;
  totalMembersCount=0;
  totalMachinesCount=0;
  

  thisMonthIncome:number=0;
  thisMonthSpending:number=0;
  notificationsCount:number=0;

  newTickets= [];

  emailAdmin:any="Chargement";
  
  isNotConfirmed:boolean = false;

  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private router: Router,
    private gym: GymproService,
    private modalController:ModalController,
    public alert:AlertController,
    public toastController:ToastController
  ) {

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



  getTickets(){
    this.newTickets= [];
    this.isLoading = true;
    

    this.gym.getGymTickets().subscribe((tickets)=>{
      console.log(tickets);

      tickets.tickets.forEach(ticket => {
        if (ticket.is_closed == 0) {
          this.newTickets.push(ticket);
        }
      });

      
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    })
  }



  getAdminInformation() {
    this.isLoading = true;
    this.auth.getAdminDetails().subscribe((data) => {
      this.isLoading = false;
      this.emailAdmin = data.admin.email
      console.log(data);

      if (data.admin.is_confirmed_admin === 0) {
        this.isNotConfirmed = true;
      }else{
        this.isNotConfirmed = false;
      }

      if (data.success == true) {
        this.daysLeft = data.admin.days_left;


        
        if (data.admin.is_in_trial_mode) {
          this.AccountType = "Mode d'essai";
          this.messageAccountType = " Une fois le mode d'essai terminé, vous devrez payer les frais d'inscription pour continuer à utiliser nos services.";
        }else{
          this.AccountType = "Mode Premium";
          this.messageAccountType = "Vous êtes en mode premimum, merci d'utiliser nos services.";
        }
      } else {
        
      }
    },(error)=>{
      this.isLoading = false;
      this.errorLoading = true;
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
          this.gymInfo = data.gym;
          this.hasAGym=true;
          this.getAdminInformation();
          this.getMachines();
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

  ionViewWillEnter(){
    this.getGymInfo();
    this.getNotificationsCounter();
    this.getMembersList();
    this.getFinancialData();
    this.getTickets();
    
  }

  
  getNotificationsCounter(){
    this.gym.getAdminNotificationsCounter().subscribe((data)=>{
      this.notificationsCount = data.notifications.length
    })
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



  getMachines() {

    this.isLoading = true;
    this.gym.getMachinesList().subscribe((res) => {
      console.log('hello ', res);
      this.isLoading = false;

      if (res.success == true) {
        var nbrMachines = 0;
        this.totalMachinesCount = res.machines.length;
        for (let i = 0; i < res.machines.length; i++) {
          var lastMaintainDate = new Date(res.machines[i].last_maintain_date);
          var today = new Date();
          today.setHours(0);
          today.setSeconds(0);
          today.setMinutes(0);
          today.setMilliseconds(0);

          var lastMaintainDateIndays = (((((today.getTime() - lastMaintainDate.getTime()) / 1000) / 60) / 60) / 24);
          if (lastMaintainDateIndays >= this.gymInfo.check_equipments_duration_days) {
            nbrMachines++;
          }
        }
        console.log(nbrMachines);
        
        this.machinesErr= nbrMachines;

      }
    }, (error) => {
      this.isLoading = false;

    })
  }

  getMembersList() {
    this.isLoading = true;
    this.gym.getGymMembersList().subscribe((res) => {
      this.isLoading = false;
      if (res.success == true) {

        var tmpMembersList = [];
        var membersWarr = [];
        
        
        this.totalMembersCount = res.members.length;
        for (let i = 0; i < res.members.length; i++) {
          if (res.members[i].isArchived === 0) {
            let lastRenewalDate = new Date(res.members[i].lastRenewalDate);
            let today = new Date();
            let hoursCounted = (((today.getTime() - lastRenewalDate.getTime()) / 1000) / 60) / 60;
            let daysPasses = Math.round(hoursCounted / 24);
            let leftDays = res.members[i].pricingPlan.duration - daysPasses;

            let member = {
              leftDays: leftDays,
              data: res.members[i]
            }

            if (leftDays <= 3 && leftDays > 0) {
              membersWarr.push(member);
            }else if (leftDays <= 0) {
              tmpMembersList.push(member);
            }


          }
        }
        console.log(tmpMembersList.length);

        this.membersErr = tmpMembersList.length;
        this.membersWarr = membersWarr.length;
        


      } else {

      }
    }, (error) => {
      this.isLoading = false;

    })
  }






    getFinancialData(){
    this.thisMonthIncome=0;
    this.thisMonthSpending=0;
    this.gym.getFinancialStat().subscribe((res)=>{
      console.log(res);
      


      var thisMonth=new Date().getMonth()+1;
      var thisYear=new Date().getFullYear();
      
      //get this month members payments 

      




      // get this month income and outcome
      res.data.paymentDetails.map((payment) => {
        var Month = new Date(payment.date).getMonth()+1;
        var year = new Date(payment.date).getFullYear();
        if (Month === thisMonth && year === thisYear) {
          this.thisMonthIncome+=payment.amount;
        }
      });

      // get this month income and outcome from transaction
      res.data.otherTransaction.map((transaction) => {
        var Month = new Date(transaction.date_transaction).getMonth()+1;
        var year = new Date(transaction.date_transaction).getFullYear();
        if (Month === thisMonth && year === thisYear) {
          
          if (transaction.amount > 0) 
            this.thisMonthIncome+=transaction.amount;  
          else  
            this.thisMonthSpending+= (transaction.amount)*-1
          
        }
      });

      




    },(error)=>{
      this.isLoading=false;
      this.errorLoading=true;
    })
  }



}
