import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { PostDetailPage } from './post-detail/post-detail.component';
import { MuroPage } from './muro/muro.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'post-detail/:id', component: PostDetailPage },
  { path: 'muro', component: MuroPage },
  {
    path: 'radio-cam',
    loadComponent: () => import('./radio-cam/radio-cam.page').then( m => m.RadioCamPage)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
