import { ChatService } from './../../services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { PublicationsService } from 'src/app/services/publications/publications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('new_chat') modal: ModalController;
  @ViewChild('popover') popover: PopoverController;
  segment = 'inicio';
  open_new_chat = false;
  users: Observable<any[]>;
  chatRooms: Observable<any[]>;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'danger'
  };

  publicaciones: any[] = [];

  constructor(
    private publicacionesService: PublicationsService,
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.getRooms();
    this.obtenerPublicacionesPorUsuario();
  }

  getRooms() {
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
  }

  async logout() {
    try {
      console.log('logout');
      this.popover.dismiss();
      await this.chatService.auth.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (e) {
      console.log(e);
    }
  }

  obtenerPublicacionesPorUsuario(): void {
    this.publicacionesService.getPublicacionesPorUsuario(this.chatService.getId())
      .then((publicaciones) => {
        this.publicaciones = publicaciones;
      })
      .catch((error) => {
        console.error('Error al obtener las publicaciones:', error);
      });
  }

  onSegmentChanged(event: any) {
    this.segment = event.detail.value;
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

  async startChat(item) {
    try {
      const room = await this.chatService.createChatRoom(item?.uid);
      console.log('room: ', room);
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
      console.log('data: ', user_data);
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

}
