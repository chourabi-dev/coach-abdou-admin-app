import { Component, OnInit, Sanitizer } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GymproService } from 'src/app/api/gympro.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-createnewmember',
  templateUrl: './createnewmember.component.html',
  styleUrls: ['./createnewmember.component.scss'],
})
export class CreatenewmemberComponent implements OnInit {

  newMemberForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    idPlan: new FormControl('',[Validators.required]),
    addDate: new FormControl('',[Validators.required]),
    email: new FormControl('',[]),
    sex: new FormControl('',[Validators.required]),

    
  })
  isLoading:boolean=true;
  plans:any=[];

  idMember="";
  form=1;
  avatar:any="https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png";

  FileTodUpload:File;

  constructor(private _sanitizer: DomSanitizer, public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) { }

  ngOnInit() {
    this.getGymPlans();
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


  getGymPlans(){
    this.isLoading=true;
    this.gym.getGymPlans().subscribe((data)=>{
      this.isLoading=false;
      
      if (data.success==true) {
        this.plans=data.plans;
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
    }
  }

  

   async uploadFile(){
    let fv=this.newMemberForm.value;
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
        //go to upload photo section
        this.closeModal();
        //add a toast;

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

  async createNewMembre(){
    let fv=this.newMemberForm.value;
        const loading = await this.loader.create({
      message: 'Chargement...',
    });

    console.log(fv);
    
    await loading.present();

    this.gym.addNewMember(fv.name,fv.email,fv.phone,fv.addDate,fv.idPlan,0,fv.sex,0).subscribe((data)=>{
      if (data.success==true) {
        //go to upload photo section
        this.idMember=data.idMember;
        this.form=2;
        loading.dismiss();
      } else {
        loading.dismiss();
        this.showAlert('Erreur',data.message);
      }
      

    },(error)=>{
      console.log(error);
      
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
    })
  }

}
