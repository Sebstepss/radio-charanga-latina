import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { PolicyAcceptanceService } from '../services/policy-acceptance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-policy-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Políticas de Uso</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>¡Bienvenidos!</h2>
      <p>Estamos encantados de que uses nuestra aplicación. Para que todos podamos disfrutarla al máximo, te pedimos que sigas estas sencillas políticas de uso:</p>

      <h3>Contenido fonográfico de la radio</h3>
      <p>Evita grabar el audio transmitido por nuestra radio y compartirlo en Internet. Esta práctica está protegida por la Ley N° 17.336 sobre Propiedad Intelectual en Chile, que otorga a los productores de fonogramas el derecho exclusivo de autorizar o prohibir la reproducción y distribución de sus fonogramas.</p>

      <h3>Sección de anuncios y mensajes</h3>
      <p>Este espacio es para compartir mensajes con respeto y amabilidad. Por eso, no permitimos palabras ofensivas ni enlaces externos.</p>

      <h3>Consecuencias por mal uso</h3>
      <p>Si detectamos un uso inapropiado, el acceso desde el dispositivo será restringido para proteger a nuestra comunidad.</p>

      <h3>Tratamiento de datos personales</h3>
      <p>En esta aplicación no solicitaremos datos personales en ningún momento. Por favor, evita compartir información sensible o privada en los mensajes o anuncios, ya que no nos hacemos responsables por el mal uso de datos expuestos por los usuarios.</p>

      <h3>Reportes y sugerencias</h3>
      <p>Si detectas algún mal uso, error o tienes una sugerencia, contáctanos a través del botón de WhatsApp situado en la parte inferior de la app.</p>

      <p>¡Gracias por ser parte de nuestra app! Tu colaboración hace la diferencia.</p>
      <ion-button expand="block" (click)="acceptPolicies()">Aceptar</ion-button>
    </ion-content>

  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PolicyModalComponent {
  constructor(
    private modalCtrl: ModalController,
    private policyService: PolicyAcceptanceService
  ) {}

  async acceptPolicies() {
    await this.policyService.recordPolicyAcceptance();
    this.modalCtrl.dismiss();
  }
}