import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-moreuserinfo',
  templateUrl: './moreuserinfo.component.html',
  styleUrls: ['./moreuserinfo.component.scss'],
})
export class MoreuserinfoComponent implements OnInit {
  @Input() progress;
  @Input() moreInfo;

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    console.log(this.progress);
    
  }

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
