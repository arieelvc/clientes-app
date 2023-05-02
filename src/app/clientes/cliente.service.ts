import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]>{
    // return of(CLIENTES);
    return this.http.get(this.urlEndPoint).pipe(
      // map( response => response as Cliente[] )
      // con el operador map transformamos los datos 
      map(response =>{
        //let permite definir una variable local dentro de un metodo o una funcion
        let clientes = response as Cliente[];

        return clientes.map(cliente =>{
          //cliente.nombre = cliente.nombre.toUpperCase();// con el operador map y el metodo uppercase transformamos los datos en mayusculas
          //registerLocaleData(localeEs,'es');//cambiamos el idioma local para la fecha
          //cliente.createAt = formatDate(cliente.createAt, 'fullDate','en-US')// con formatDate podemos transformar el formato de la fecha
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate')
          return cliente;
        });
      })

    );
  }

  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError((e) => {
        if(e.status==400 ){
          return throwError(() => e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    )
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError((e) => {
        if(e.status==400 ){
          return throwError(() => e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError((e) => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }
}
