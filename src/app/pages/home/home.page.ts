import { ChatService } from './../../services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { error } from 'console';
import { Observable, forkJoin, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PublicationsService } from 'src/app/services/publications/publications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('new_chat') modal: ModalController;
  @ViewChild('publication') modalPublication: ModalController;
  @ViewChild('popover') popover: PopoverController;
  segment = 'inicio';
  open_new_chat = false;
  open_new_publication = false;
  users: Observable<any[]>;
  chatRooms: Observable<any[]>;

  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'danger'
  };

  publicacionesByUser: any[] = [];
  comments: any[] = [];
  reactions: any[] = [];
  publicaciones: any[] = [];

  constructor(
    public authService: AuthService,
    private publicacionesService: PublicationsService,
    private router: Router,
    private chatService: ChatService,
    
  ) { }

  ngOnInit() {
    this.getRooms();
    forkJoin([this.getAllsPublications(), this.getAllsComments(), this.getAllsReactions()]).subscribe({
      next: () => this.filterData(),
      error: e => console.log(e)
    });
  }

  filterData() {
    this.publicaciones = this.publicaciones.map(publicacion => {
      return {
        ...publicacion,
        comentarios: this.comments.filter(comment => comment.publicacion_id == publicacion.id),
        reacciones: this.reactions.filter(comment => comment.publicacion_id == publicacion.id)
      }
    });
    console.log(this.publicaciones);
  }

  getRooms() {
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
  }

  async logout() {
    try {
      this.popover.dismiss();
      await this.chatService.auth.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (e) {
      console.log(e);
    }
  }

  getAllsPublications(): Observable<any> {
    return new Observable((observer: any) => {
      this.publicacionesService.getAllsPublications().subscribe((publicaciones) => {
        this.publicaciones = publicaciones;
        observer.next();
        observer.complete();
      }, (error) => {
        observer.error(error);
        console.error('Error al obtener los registros:', error);
      });
    });
  }

  getAllsComments(): Observable<any> {
    return new Observable((observer: any) => {
      this.publicacionesService.getAllsComments().subscribe({
        next: result => {
          this.comments = result;
          observer.next();
          observer.complete();
        },
        error: e => {
          console.log(e);
          observer.error(e);
        }
      });
    })
  }

  getAllsReactions(): Observable<any> {
    return new Observable((observer: any) => {
      this.publicacionesService.getAllsReactions().subscribe({
        next: result => {
          this.reactions = result;
          observer.next();
          observer.complete();
        },
        error: e => {
          console.log(e);
          observer.error(e);
        }
      });
    });
  }

  getPublicationsByUSer(): void {
    this.publicacionesService.getPublicationsByUSer(this.chatService.getId())
      .then((publicaciones) => {
        this.publicacionesByUser = publicaciones.map((publication: any) => {
          const date: any = (publication.fecha).toDate();
          let meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
          const date2 = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}, ${date.getHours()}:${(date.getMinutes() > 10) ? date.getMinutes() : '0' + date.getMinutes()}`;
          return {
            ...publication, time: date2
          }
        });
      })
      .catch((error) => {
        console.error('Error al obtener las publicaciones:', error);
      });
  }

  onSegmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  reactionCreate_Delete(publicacion_id: any, user_id: any) {
    const publication = this.publicaciones.find(publicacion => publicacion.id == publicacion_id);
    const reaction = publication.reacciones.find(reaction => reaction.user_id == user_id);
    if (reaction) {
      this.publicacionesService.deleteReaction(reaction.id).then(
        result => {
          publication.reacciones = publication.reacciones.filter(reaction => reaction.user_id != user_id);
        }
      ).catch(e => console.log(e));
    } else {
      const data = { publicacion_id: publicacion_id, user_id: user_id, fecha: new Date() };
      this.publicacionesService.createReaction(data).then(
        result => {
          publication.reacciones.push({ id: result.id, ...data });
        }
      ).catch(e => console.log(e));
    }
  }

  newChat() {
    this.open_new_chat = true;
    if (!this.users) this.getUsers();
  }

  getUsers() {
    this.chatService.getUsers();
    this.users = this.chatService.users;
  }

  onWillDismiss(event: any) { }

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }

  cancelPublication() {
    this.modalPublication.dismiss();
    this.open_new_publication = false;
  }

  async startChat(item) {
    try {
      const room = await this.chatService.createChatRoom(item?.uid);
      this.cancel();
      const navData: NavigationExtras = {
        queryParams: {
          name: item?.name
        }
      };
      this.router.navigate(['/', 'home', 'chats', room?.id], navData);
    } catch (e) {
      console.log(e);
    }
  }

  getChat(item) {
    (item?.user).pipe(
      take(1)
    ).subscribe(user_data => {
      const navData: NavigationExtras = {
        queryParams: {
          name: user_data?.name
        }
      };
      this.router.navigate(['/', 'home', 'chats', item?.id], navData);
    });
  }

  getUser(user: any) {
    return user;
  }

  reactionReturn(publicacion: any) {
    if (publicacion.reacciones) {
      return publicacion.reacciones.some(reaccion => reaccion.user_id == this.authService.getId());
    } else {
     return false;
    }
  }




  //perfil

  // perfil
 open_perfil = false;

 openPerfil() {
   this.open_perfil = true;
    // Llena el formulario con los datos actuales del usuario
 }
 
 closePerfil() {
   this.open_perfil = false;
 }
 
 onWillDismissPerfil(event) {


   
   // Aquí puedes manejar cualquier lógica necesaria cuando el modal se está a punto de cerrar
 }

 

}
