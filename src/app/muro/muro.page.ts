import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { IonicModule, AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService, Comment } from '../services/comment.service';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-muro',
  templateUrl: './muro.page.html',
  styleUrls: ['./muro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MuroPage implements OnInit, OnDestroy {
  comments: Comment[] = [];
  newComment: Comment = { name: '', avatar: '', content: '', timestamp: Timestamp.now(), isExpress: false };
  avatars = [
    'assets/avatar1.png',
    'assets/avatar2.png',
    'assets/avatar3.png',
    'assets/avatar4.png',
    'assets/avatar5.png',
    'assets/avatar6.png',
    'assets/avatar7.png',
    'assets/avatar8.png',
    'assets/avatar9.png',
    'assets/avatar10.png',
    'assets/avatar11.png',
    'assets/avatar12.png',
    'assets/avatar13.png'
  ];
  validationErrors = { name: false, content: false, avatar: false };
  lastVisible: any = null;
  isModalOpen = false;
  isAvatarModalOpen = false;
  previewAvatar: string | null = null;
  highlightedComment: Comment | null = null;
  highlightTimeLeft: number = 30;
  showInitialModal = false;
  showPolicyModal = false;
  userName = '';
  private commentSubscription: Subscription | null = null;
  acceptedPolicies: boolean = false;
  private highlightInterval: any;

  constructor(
    private alertController: AlertController,
    private commentService: CommentService
  ) {}

  async reportComment(comment: Comment) {
    if (!comment.id) {
      console.error('Comment ID is undefined');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Reportar comentario',
      message: '¿Estás seguro de que quieres reportar este comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Reportar',
          handler: () => {
            this.commentService.reportComment(comment.id!).then(() => {
              comment.reported = true;
              this.presentAlert('Reportaste este mensaje. Revisaremos si incumple las normas.');
            }).catch(error => {
              console.error('Error al reportar el comentario:', error);
              this.presentAlert('Hubo un error al reportar el comentario. Por favor, intenta de nuevo.');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.checkUserInfo();
    this.loadInitialComments();
    this.subscribeToComments();
  }

  highlightComment(comment: Comment) {
    this.highlightedComment = { ...comment }; // Crea una copia del comentario
    console.log('Highlighted Comment:', this.highlightedComment); // Para depuración
    this.highlightTimeLeft = 30;
    this.startHighlightCountdown();
  }


  startHighlightCountdown() {
    if (this.highlightInterval) {
      clearInterval(this.highlightInterval);
    }
    this.highlightInterval = setInterval(() => {
      this.highlightTimeLeft--;
      if (this.highlightTimeLeft <= 0) {
        this.clearHighlightedComment();
      }
    }, 1000);
  }

  clearHighlightedComment() {
    this.highlightedComment = null;
    if (this.highlightInterval) {
      clearInterval(this.highlightInterval);
    }
  }
  ngOnDestroy() {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
    this.clearHighlightedComment();
  }



  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  resetUserInfo() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('acceptedPolicies');
    this.showInitialModal = true;
    this.newComment = { name: '', avatar: '', content: '', timestamp: Timestamp.now(), isExpress: false };
  }


  continueToPolicy() {
    if (this.newComment.name.trim() === '' || !this.newComment.avatar) {
      this.presentAlert('Por favor, ingresa tu nombre y selecciona un avatar.');
      return;
    }

    if (!this.acceptedPolicies) {
      this.presentAlert('Por favor, acepta las políticas antes de continuar.');
      return;
    }

    // Guardar la información del usuario en localStorage
    localStorage.setItem('userInfo', JSON.stringify({ 
      name: this.newComment.name, 
      avatar: this.newComment.avatar 
    }));
    localStorage.setItem('acceptedPolicies', 'true');
    this.showInitialModal = false;
  }


  acceptPolicy() {
    localStorage.setItem('userInfo', JSON.stringify({ name: this.newComment.name, avatar: this.newComment.avatar }));
    localStorage.setItem('acceptedPolicies', 'true');
    this.showPolicyModal = false;
  }

  checkUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    const acceptedPolicies = localStorage.getItem('acceptedPolicies');
    if (userInfo) {
      const { name, avatar } = JSON.parse(userInfo);
      this.newComment.name = name;
      this.newComment.avatar = avatar;
      if (!acceptedPolicies) {
        this.showPolicyModal = true;
      }
    } else {
      this.showInitialModal = true;
    }
  }

  // These methods have been removed

  loadInitialComments() {
    this.commentService.getComments().subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
        if (comments.length > 0) {
          this.lastVisible = comments[comments.length - 1];
        }
      },
      (error) => {
        console.error('Error al cargar comentarios iniciales:', error);
      }
    );
  }

  subscribeToComments() {
    this.commentSubscription = this.commentService.getCommentsRealTime().subscribe(
      (newComments: Comment[]) => {
        // Actualizar la lista de comentarios
        this.comments = newComments;
      },
      (error) => {
        console.error('Error en la suscripción de comentarios:', error);
      }
    );
  }


  loadMoreComments(event: InfiniteScrollCustomEvent) {
    if (this.lastVisible) {
      this.commentService.getComments(this.lastVisible).subscribe(
        (newComments: Comment[]) => {
          if (newComments.length > 0) {
            // Filtrar los comentarios duplicados
            const uniqueNewComments = newComments.filter(newComment => 
              !this.comments.some(existingComment => 
                existingComment.timestamp.toDate().getTime() === newComment.timestamp.toDate().getTime()
              )
            );

            // Añadir solo los comentarios únicos
            this.comments = [...this.comments, ...uniqueNewComments];
            this.lastVisible = newComments[newComments.length - 1];
          }
          event.target.complete();

          // Verificar si no hay más comentarios para cargar
          if (newComments.length === 0) {
            event.target.disabled = true;
          }
        },
        (error) => {
          console.error('Error al cargar más comentarios:', error);
          event.target.complete();
        }
      );
    } else {
      event.target.complete();
      event.target.disabled = true;
    }
  }

  async addComment() {
    if (this.validateComment()) {
      this.newComment.timestamp = Timestamp.now();
      try {
        await this.commentService.addComment(this.newComment);
        this.highlightComment(this.newComment);
        this.newComment.content = ''; // Limpiar el contenido después de enviar
      } catch (error) {
        console.error('Error al añadir comentario:', error);
        this.presentAlert('Hubo un error al enviar tu comentario. Por favor, intenta de nuevo.');
      }
    }
  }







  validateComment(): boolean {
    let isValid = true;
    this.validationErrors = { name: false, content: false, avatar: false };

    if (!this.newComment.name.trim()) {
      this.validationErrors.name = true;
      isValid = false;
    }
    if (!this.newComment.content.trim()) {
      this.validationErrors.content = true;
      isValid = false;
    }
    if (!this.newComment.avatar) {
      this.validationErrors.avatar = true;
      isValid = false;
    }

    if (!isValid) {
      this.presentAlert('Por favor, completa todos los campos requeridos.');
    }

    return isValid;
  }
// Nuevo método para abrir el modal de edición de información del usuario
openEditUserInfoModal() {
  this.showInitialModal = true;
}
openAvatarModal() {
  this.isAvatarModalOpen = true;
}

closeAvatarModal() {
  this.isAvatarModalOpen = false;
}

selectAvatar(avatar: string) {
  this.newComment.avatar = avatar;
  this.closeAvatarModal();
}

}

