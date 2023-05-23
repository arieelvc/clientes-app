import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Region } from './region';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    // return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        });
      }),
      // map( response => response as Cliente[] )
      // con el operador map transformamos los datos 
      map((response: any) => {
        //let permite definir una variable local dentro de un metodo o una funcion
        (response.content as Cliente[]).map(cliente => {
          //cliente.nombre = cliente.nombre.toUpperCase();// con el operador map y el metodo uppercase transformamos los datos en mayusculas
          //registerLocaleData(localeEs,'es');//cambiamos el idioma local para la fecha
          //cliente.createAt = formatDate(cliente.createAt, 'fullDate','en-US')// con formatDate podemos transformar el formato de la fecha
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate')
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        });
      })

    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError((e) => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    )
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError((e) => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError((e) => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);

  }
}
