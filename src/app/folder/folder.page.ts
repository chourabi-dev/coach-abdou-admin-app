import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UsersService } from '../api/users.service';
import { GymproService } from '../api/gympro.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  adminName: String = "Chargement...";
  adminEmail: String = "Chargement...";
  adminIMGURL: String = "";
  gymInfo:any;
  public selectedIndex = 0;
  isLoading: boolean = true;


  public appPages = [
    {
      title: 'Dashboard',
      url: '/home/dashboard',
      icon: 'home-outline',
      badge:0
    },
    {
      title: 'My members',
      url: '/home/members',
      icon: 'body-outline',
      badge: 0
    },
    


    {
      title: 'Notifications',
      url: '/home/notifications',
      icon: 'notifications-outline',
      badge: 0
    },    

    /*{
      title: 'Complaints',
      url: '/home/tickets',
      icon: 'chatbox-ellipses-outline',
      badge: 0
    },*/
    

        /*{
      title: 'Mes employés',
      url: '/home/employees',
      icon: 'people-outline',
      badge: 0
    },*/
    

    {
      title: 'Finance',
      url: '/home/finance',
      icon: 'cash-outline',
      badge: 0
    },
    {
      title: 'Settings',
      url: '/home/settings',
      icon: 'settings-outline',
      badge: 0
    },
  ];





  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private router: Router,
    private gym: GymproService,
    private fcm: FCM
    
  ) {

  }

  initializeApp() {
    
  }


  getFcm(){

    try {
      this.fcm.getToken().then(token => {
        this.gym.updateAdminFCM(token).subscribe((data)=>{
          console.log("fcm",token,"response",data);
          
        })
      });
    } catch (error) {
      
    }
  }


  getTicketsCount(){
    this.gym.getGymDetails().subscribe((data)=>{
      
      let counter = 0;

      data.gym.tickets.forEach(ticket => {
        if (ticket.is_closed == 0) {
          counter++;
        }
      });

      //this.appPages[3].badge = counter;

      
    });
  }

  menuClick(i) {
    this.appPages[i].badge = 0;
  }


  getGymBadgesCounters() {
    this.getGymInfo();
    this.getNotificationsCounerts();
  }



  async sessionExpiredError(msg) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: msg,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

            window.localStorage.removeItem('token');
            this.router.navigate(['/auth']);

          }
        }
      ]
    });

    await alert.present();
  }

  getAdminInformation() {
    this.auth.getAdminDetails().subscribe((data) => {
      console.log(data);
      if (data.success == true) {
        this.adminEmail = data.admin.email;
        this.adminName = data.admin.fullname;
        this.adminIMGURL = data.admin.avatar;
      } else {
        this.sessionExpiredError(data.message);
      }
    });
  }

  ngOnInit() {
    this.getFcm();
  }

  ionViewDidEnter() {
    this.getAdminInformation();
    this.getGymBadgesCounters();
    this.getNotificationsCounerts();
    this.getTicketsCount();

  }

  getNotificationsCounerts(){
    this.gym.getAdminNotificationsCounter().subscribe((data)=>{
      this.appPages[2].badge = data.notifications.length
    })
  }

  async logOut() {


    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'LOG OUT',
          handler: () => {
            window.localStorage.clear();
            this.router.navigate(['/auth']);
          }
        }
      ]
    });

    await alert.present();

  }

  getGymInfo() {
    this.isLoading = true;
    this.gym.getGymDetails().subscribe((data) => {
      this.isLoading = false;
      console.log(data);
      if (data.success == true) {
        if (data.gym != null) {
          this.gymInfo=data.gym;

          // we can get the machines list now
          this.getMachines();
          this.getMembersList();
          this.getTicketsCount();
        }
      }
      else {
      }

    }, (error) => {
      this.isLoading = false;

    })
  }


  getMachines() {

    this.isLoading = true;
    this.gym.getMachinesList().subscribe((res) => {
      console.log('hello ', res);
      this.isLoading = false;

      if (res.success == true) {
        var nbrMachines = 0;

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
        
        this.appPages[2].badge = nbrMachines;

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

            if (leftDays <= 3) {
              tmpMembersList.push(member);
            }


          }
        }
        console.log(tmpMembersList.length);

        this.appPages[1].badge = tmpMembersList.length;


      } else {

      }
    }, (error) => {
      this.isLoading = false;

    })
  }



}
