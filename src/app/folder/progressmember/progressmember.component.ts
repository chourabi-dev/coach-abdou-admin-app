import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-progressmember',
  templateUrl: './progressmember.component.html',
  styleUrls: ['./progressmember.component.scss'],
})
export class ProgressmemberComponent implements OnInit {
  @Input() progress;
  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
