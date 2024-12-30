import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-radio-cam',
  templateUrl: './radio-cam.page.html',
  styleUrls: ['./radio-cam.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RadioCamPage implements OnInit {
  safeUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private navCtrl: NavController
  ) {
    // Reemplaza esta URL con la URL de tu transmisión de video
    const url = 'https://charangalatina.cl/radio-cam/';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
}

