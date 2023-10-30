import { Component, OnInit } from '@angular/core';
import { NewgymComponent } from '../newgym/newgym.component';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { NewmoneyoperationComponent } from '../newmoneyoperation/newmoneyoperation.component';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { EditpaymentdataComponent } from '../editpaymentdata/editpaymentdata.component';


@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {

  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";

  balance:any=0;
  totalIncome:any=0;
  totalSpent:any=0;
  thisMonthPayments:any=[];
  otherTransaction:any=[];


  thisMonthIncome:number=0;
  thisMonthSpending:number=0;

  monthlySpending=[];
  monthlyIncomes=[];



  /**************chart data */
  lineChartData: ChartDataSets[] =[
    { data: this.monthlyIncomes, label: 'Revenu annuel ( TND )' },
    { data: this.monthlySpending, label: 'Dépenses annuelles ( TND )' },
  ] ;

  lineChartLabels: Label[] = ['janvier',	'février', 'mars', 'avril',	'mai', 'juin', 'juillet',	'août',	'septembre',	'octobre',	'novembre',	'décembre']

  lineChartOptions = {
    responsive: true,
    
  };

  lineChartColors: Color[] = [
    {
      borderColor: '#03a9f4',
      backgroundColor: 'rgba(73,157,223,0.28)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255,89,77,0.28)',
    },
    
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
/********************end of chart data */



  /**************chart data */
  thisMonthlineChartData: ChartDataSets[] =[
    { data: this.monthlyIncomes, label: 'Revenu mensuel ( TND )' },
    { data: this.monthlySpending, label: 'Dépenses mensuel ( TND )' },
  ] ;

  thisMonthlineChartLabels: Label[] = []

  thisMonthlineChartOptions = {
    responsive: true,
  };

  thisMonthlineChartColors: Color[] = [
    {
      borderColor: '#03a9f4',
      backgroundColor: 'rgba(73,157,223,0.28)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255,89,77,0.28)',
    },
    
  ];

  thisMonthlineChartLegend = true;
  thisMonthlineChartPlugins = [];
  thisMonthlineChartType = 'line';
/********************end of chart data */

 


  constructor(public modalController:ModalController,private gym:GymproService,private alert:AlertController,public toastController:ToastController,public loader:LoadingController) {

  }

  async newMoneyTransaction(){
    const modal = await this.modalController.create({
      component: NewmoneyoperationComponent
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();
  }
  

  getFinancialData(){
    this.thisMonthIncome=0;
    this.thisMonthSpending=0;
    this.gym.getFinancialStat().subscribe((res)=>{
      console.log(res);
      
      this.balance=res.data.balance;
      this.totalIncome=res.data.totalIncome;
      this.totalSpent=res.data.totalSpending;


      var thisMonth=new Date().getMonth()+1;
      var thisYear=new Date().getFullYear();
      
      //get this month members payments 

      
      this.thisMonthPayments=res.data.paymentDetails.filter((payment) =>{
        var paymentMonth = new Date(payment.date).getMonth()+1;
        var paymentYear = new Date(payment.date).getFullYear();
        return (thisMonth === paymentMonth && thisYear === paymentYear );
        
      });

      $(document).ready(function() {
        $('.paymentsTable').DataTable();
      });



      

      this.otherTransaction=res.data.otherTransaction;
      $(document).ready(function() {
        $('.table-transaction').DataTable();
      });



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

     console.log(this.thisMonthSpending);

     /****hundling annuel chart  */
     var monthlyIncomes = [];
     var monthlySpending = [];
     
     var today = new Date();
     var month =today.getMonth();
     var year=  today.getFullYear();

     for (let i = 1; i <= 12; i++) {
       var tmpIncome=0;
       var tmpOutCome=0;

       //starting from members payments
       for (var j = 0; j < res.data.paymentDetails.length; j++) {
         var paymentDate= new Date(res.data.paymentDetails[j].date);

         if (paymentDate.getMonth()+1 == i && paymentDate.getFullYear() === thisYear) {
           tmpIncome+=res.data.paymentDetails[j].amount;
         }
       }

       //manage the transactions
       for (var j = 0; j < res.data.otherTransaction.length; j++) {
        var paymentDate= new Date(res.data.otherTransaction[j].date_transaction);
        if (paymentDate.getMonth()+1 == i && paymentDate.getFullYear() === thisYear) {
          if (res.data.otherTransaction[j].amount > 0) {
            tmpIncome+= res.data.otherTransaction[j].amount;
          }else{
            tmpOutCome+= (res.data.otherTransaction[j].amount * -1);
          }
        }
      }
       monthlyIncomes.push(tmpIncome);
       monthlySpending.push(tmpOutCome);
     }
     
     this.monthlyIncomes=monthlyIncomes;
     this.monthlySpending=monthlySpending;
     
     console.log(this.monthlyIncomes);
     this.lineChartData=[
      { data: this.monthlyIncomes, label: 'Revenu annuel ( TND )' },
      { data: this.monthlySpending, label: 'Dépenses annuelles ( TND )' },
      
      
    ];
     

    /************************ hundling this month spending ************************* */
      var today= new Date();
      var nextMonthDate=new Date(today.getFullYear(),today.getMonth()+1,0,0,0,0,0);
      var thisMonthDate=new Date(today.getFullYear(),today.getMonth(),0,0,0,0,0);
      var thisMonthDays = (nextMonthDate.getTime()-thisMonthDate.getTime())/1000/60/60/24 ;
      
      var tmpDaysLabels=[];
      var daylyIncomeForThisMonth=[];
      var daylySpendingForThisMonth=[];
      

      for (let i = 0; i < thisMonthDays; i++) {
        tmpDaysLabels.push(i+1);
        var tmpIncome=0;
        var tmpOutCome=0;

       //starting from members payments
       for (var j = 0; j < res.data.paymentDetails.length; j++) {
         var paymentDate= new Date(res.data.paymentDetails[j].date);
         if ((paymentDate.getMonth()+1 === month+1) && (paymentDate.getFullYear() === year) && (paymentDate.getDate()===i+1)) {
          
          tmpIncome+=res.data.paymentDetails[j].amount;



         }
       }

       //manage the transactions
       for (var x = 0; x < res.data.otherTransaction.length; x++) {
        var paymentDate= new Date(res.data.otherTransaction[x].date_transaction);
        
        if ((paymentDate.getMonth()+1 === month+1) && (paymentDate.getFullYear() === year) && (paymentDate.getDate()===i+1) ) {

          if (res.data.otherTransaction[x].amount > 0) {
            tmpIncome+= res.data.otherTransaction[x].amount;
          }else{
            tmpOutCome+= (res.data.otherTransaction[x].amount * -1);
          }
        }
      }
       daylyIncomeForThisMonth.push(tmpIncome);
       daylySpendingForThisMonth.push(tmpOutCome);
      }

      console.log(daylyIncomeForThisMonth);
      console.log(daylySpendingForThisMonth);
      
      

      this.thisMonthlineChartLabels=tmpDaysLabels;
      this.thisMonthlineChartData=[
        { data: daylyIncomeForThisMonth, label: 'Revenu mensuel ( TND )' },
        { data: daylySpendingForThisMonth, label: 'Dépenses mensuel ( TND )' },
      ]



    },(error)=>{
      this.isLoading=false;
      this.errorLoading=true;
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
          this.hasAGym=true;

          //updating UI
          this.gymName=data.gym.name
          this.getFinancialData();

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
    //this.getGymInfo();


  }

  ionViewWillEnter(){
    this.getGymInfo();
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


  async editPaymentData(data){
    const modal = await this.modalController.create({
      component: EditpaymentdataComponent,
      componentProps: {
        'data': data
      }
    })

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();
  }



  async deleteTransaction(transaction){
    const alert = await this.alert.create({
      header: "Supprimer la transcation",
      message: "Voulez-vous vraiment supprimer cette transcation?",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Supprimer',
          cssClass: 'danger',
          handler: () => {
            this.deleteTransactionNow(transaction.id_transaction);
            

          }
        },
        
      ]
    });

    await alert.present();
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

  async deleteTransactionNow(id){
    const loading = await this.loader.create({
      message: 'Suppression...',
    });

    await loading.present();
    this.gym.deleteTransaction(id).subscribe((data)=>{

      loading.dismiss();
      if (data.success==true) {
        //add a toast;
        this.presentToast(data.message).then(()=>{
          this.getGymInfo();
        })
        

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
