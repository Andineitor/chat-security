import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { PublicationsService } from 'src/app/services/publications/publications.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-view-publication',
  templateUrl: './view-publication.page.html',
  styleUrls: ['./view-publication.page.scss'],
})
export class ViewPublicationPage implements OnInit {

  publicacion: any = {};
  comentarios: any[] = [];
  reacciones: any[] = [];
  message: any = '';

  id: any = this.route_param.snapshot.paramMap.get('id');

  constructor(private publicacionesService: PublicationsService,
    public authService: AuthService,
    private route_param: ActivatedRoute) { }

  ngOnInit() {
    forkJoin([this.getPublication(), this.getComments(), this.getReactions()]).subscribe({
      next: () => {
        this.publicacion.reacciones = this.reacciones;
        this.publicacion.comentarios = this.comentarios;
        console.log(this.publicacion);
      },
      error: error => console.log(error)
    });
  }

  getPublication() {
    return new Observable((observer: any) => {
      this.publicacionesService.getPublication(this.id).subscribe({
        next: (result: any) => {
          const date = (result.fecha).toDate();
          let meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
          const time = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}, ${date.getHours()}:${(date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes()}`;
          this.publicacion = { ...result, time }
          observer.next();
          observer.complete();
        },
        error: e => observer.error(e)
      });
    })
  }

  getComments(): Observable<any> {
    return new Observable((observer: any) => {
      this.publicacionesService.getCommentsByPublications(this.id).then(
        resul => {
          this.comentarios = resul.map(comentario => {
            const date = (comentario.fecha).toDate();
            let meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
            const time = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}, ${date.getHours()}:${(date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes()}`;
            return { ...comentario, time }
          });
          this.comentarios.sort((a, b) => a.fecha.toDate() - b.fecha.toDate());
          observer.next();
          observer.complete();
        }
      ).catch(e => observer.error(e));
    })
  }

  getReactions(): Observable<any> {
    return new Observable((observer: any) => {
      this.publicacionesService.getReactionsByPublications(this.id).then(
        resul => {
          this.reacciones = resul;
          observer.next();
          observer.complete();
        }
      ).catch(e => observer.error(e));
    })
  }

  reactionCreate_Delete(publicacion_id: any, user_id: any) {
    const reaction = this.publicacion.reacciones.find(reaction => reaction.user_id == user_id);
    if (reaction) {
      this.publicacionesService.deleteReaction(reaction.id).then(
        result => {
          this.publicacion.reacciones = this.publicacion.reacciones.filter(reaction => reaction.user_id != user_id);
        }
      ).catch(e => console.log(e));
    } else {
      const data = { publicacion_id: this.id, user_id: user_id, fecha: new Date() };
      this.publicacionesService.createReaction(data).then(
        result => {
          this.publicacion.reacciones.push({ id: result.id, ...data });
        }
      ).catch(e => console.log(e));
    }
  }


  reactionReturn(publicacion: any) {
    if (publicacion.reacciones) {
      return publicacion.reacciones.some(reaccion => reaccion.user_id == this.authService.getId());
    } else {
      return false;
    }
  }

  createComment() {
    const data = { fecha: new Date(), name_user: this.authService.getName(), photo_user: this.authService.getPhoto(), publicacion_id: this.id, texto: this.message, user_id: this.authService.getID() };
    this.publicacionesService.createComments(data).then(
      result => {
        this.message = '';
        this.ngOnInit();
      }
    ).catch(e => console.log(e));
  }

}
