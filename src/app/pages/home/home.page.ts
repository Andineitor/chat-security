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
  publicaciones: any[] = [];

  constructor(
    private publicacionesService: PublicationsService,
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.getRooms();
    this.getPublicationsByUSer();
    this.getAllsPublications();
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

  getAllsPublications() {
    this.publicacionesService.getAllsPublications().subscribe((publicaciones) => {
      this.publicaciones = publicaciones.map((publication: any) => {
        const date: any = (publication.fecha).toDate();
        let meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const date2 = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}, ${date.getHours()}:${(date.getMinutes() > 10) ? date.getMinutes() : '0' + date.getMinutes()}`;
        return {
          ...publication, time: date2
        }
      });
      console.log(this.publicaciones);
    }, (error) => {
      console.error('Error al obtener los registros:', error);
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

}
