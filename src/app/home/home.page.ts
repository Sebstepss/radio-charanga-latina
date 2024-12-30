import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WordPressService } from '../services/wordpress.service';
import { ClientService, Client } from '../services/client.service';
import { AudioService } from '../services/audio.service';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StoryModalComponent } from '../story-modal/story-modal.component'; // Asegúrate de crear este componente
import { PolicyAcceptanceService } from '../services/policy-acceptance.service';
import { PolicyModalComponent } from '../policy-modal/policy-modal.component';

interface StaffMember {
  nombre: string;
  cargo: string;
  foto: string;
}

interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media_url: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, PolicyModalComponent]
})
export class HomePage implements OnInit {
  isDarkModeEnabled = false;
  staffMembers: StaffMember[] = [];
  posts: Post[] = [];
  clients: Client[] = [];

  constructor(
    private wordpressService: WordPressService,
    private clientService: ClientService,
    public audioService: AudioService,
    private firestore: Firestore,
    private router: Router,
    private modalController: ModalController,
    private policyService: PolicyAcceptanceService
  ) {}

  async ngOnInit() {
    this.loadStaff();
    this.loadPosts();
    this.loadClients();
    if (!this.policyService.hasPolicyBeenAccepted()) {
      await this.showPolicyModal();
    }
  }

  loadStaff() {
    const staffRef = collection(this.firestore, 'staff');
    collectionData(staffRef).subscribe((staff: any[]) => {
      this.staffMembers = staff;
    });
  }

  loadPosts() {
    this.wordpressService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  toggleDarkMode(event: any) {
    this.isDarkModeEnabled = event.detail.checked;
    document.body.classList.toggle('dark', this.isDarkModeEnabled);
  }

  openStaffDetail(staffMember: StaffMember) {
    console.log('Abriendo detalles del miembro del staff:', staffMember);
    // Implementa la lógica para abrir los detalles del miembro del staff
  }

  openPost(post: Post) {
    this.router.navigate(['/post-detail', post.id]);
  }

  async openStory(client: Client) {
    const modal = await this.modalController.create({
      component: StoryModalComponent,
      componentProps: {
        client: client
      }
    });
    return await modal.present();
  }

  togglePlayPause() {
    this.audioService.togglePlayPause();
  }

  openWhatsApp() {
    const phoneNumber = '56971446192'; // Número en formato internacional sin el '+'
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_system');
  }
openSocialMedia(platform: string) {
  let url: string;
  switch (platform) {
    case 'facebook':
      url = 'https://www.facebook.com/charangalatinachile';
      break;
    case 'instagram':
      url = 'https://www.instagram.com/charangalatina';
      break;
    default:
      console.error('Plataforma no reconocida');
      return;
  }
  window.open(url, '_system');
}

async showPolicyModal() {
  const modal = await this.modalController.create({
    component: PolicyModalComponent
  });
  return await modal.present();
}
}
